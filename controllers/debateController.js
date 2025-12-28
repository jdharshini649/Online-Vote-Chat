import { Debate } from '../models/debateModel.js';
import { Message } from '../models/messageModel.js';

const defaultTeams = [
  { name: 'Team A', members: [], totalVotes: 0,tName:"" },
  { name: 'Team B', members: [], totalVotes: 0, tName : "" },
];

export const createDebate = async (req, res) => {
  try {
    const { title, description, duration, tName } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    defaultTeams[0].tName = tName[0]
    defaultTeams[1].tName = tName[1]
    const debate = await Debate.create({
      title,
      description,
      duration: duration || 10,
      teams: defaultTeams,
      status: 'upcoming',
    });
    res.status(201).json(debate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllDebates = async (req, res) => {
  try {
    const debates = await Debate.find().sort({ createdAt: -1 });
    res.json(debates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDebateById = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) return res.status(404).json({ message: 'Debate not found' });
    res.json(debate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinDebate = async (req, res) => {
  try {
    const { teamName } = req.body; // 'Team A' or 'Team B'
    if (!['Team A', 'Team B'].includes(teamName)) {
      return res.status(400).json({ message: 'Invalid team name' });
    }
    // Use atomic updates: remove the user from all team member arrays, then add them to the chosen team.
    // First, ensure debate exists and is upcoming
    const debate = await Debate.findById(req.params.id);
  if (!debate) return res.status(404).json({ message: 'Debate not found' });
  if (debate.status === 'ended') return res.status(400).json({ message: 'Cannot join ended debate' });

    console.log(`User ${req.user._id} joining debate ${req.params.id} -> ${teamName}`);

    // Remove user from any team they may be in
    await Debate.updateOne({ _id: debate._id }, { $pull: { 'teams.$[].members': req.user._id } });

    // Add user to the selected team (use $addToSet to avoid duplicates)
    const addResult = await Debate.updateOne(
      { _id: debate._id, 'teams.name': teamName },
      { $addToSet: { 'teams.$.members': req.user._id } }
    );

    if (addResult.matchedCount === 0) {
      return res.status(400).json({ message: 'Team not found or debate invalid' });
    }

    // Fetch fresh debate doc to return/emit
    const updated = await Debate.findById(debate._id);

    // Broadcast the updated debate to sockets in the room (if io available)
    try {
      const io = req.app.get('io');
      if (io) {
        const room = `debate_${updated._id}`;
        io.to(room).emit('debate_updated', updated);
      }
    } catch (e) {
      console.error('Failed to emit debate_updated from joinDebate:', e);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const startDebate = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) return res.status(404).json({ message: 'Debate not found' });
    if (debate.status !== 'upcoming') return res.status(400).json({ message: 'Debate already started or ended' });

    debate.status = 'live';
    debate.startTime = new Date();
    debate.endTime = new Date(Date.now() + (debate.duration || 10) * 60 * 1000);
    await debate.save();

    res.json(debate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const endDebate = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) return res.status(404).json({ message: 'Debate not found' });

    // Aggregate votes from messages per team
    const messages = await Message.find({ debateId: debate._id });
    const teamVotes = { 'Team A': 0, 'Team B': 0 };
    messages.forEach((m) => {
      teamVotes[m.teamName] += m.votes || 0;
    });

    debate.teams = debate.teams.map((t) => ({ ...t.toObject(), totalVotes: teamVotes[t.name] || 0 }));

    let winner = null;
    if (teamVotes['Team A'] > teamVotes['Team B']) winner = 'Team A';
    else if (teamVotes['Team B'] > teamVotes['Team A']) winner = 'Team B';

    debate.winnerTeam = winner;
    debate.status = 'ended';
    debate.endTime = new Date();
    await debate.save();

    res.json({ debateId: debate._id, winnerTeam: winner, teamVotes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
