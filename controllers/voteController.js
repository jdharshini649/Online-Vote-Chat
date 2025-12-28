import { Vote } from '../models/voteModel.js';
import { Message } from '../models/messageModel.js';
import { Debate } from '../models/debateModel.js';

export const castVote = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { value, teamName, debateId } = req.body; // value 1 or -1
    if (![1, -1].includes(value)) return res.status(400).json({ message: 'Invalid vote value' });
    if (!['Team A', 'Team B'].includes(teamName)) return res.status(400).json({ message: 'Invalid team name' });

    // Upsert vote per user per message
    const existing = await Vote.findOne({ messageId, userId: req.user._id });
    let delta = value;
    if (existing) {
      if (existing.value === value) {
        // same vote, no change
        return res.json({ message: 'Vote unchanged' });
      } else {
        delta = value - existing.value; // e.g., 1 - (-1) = 2 swing
        existing.value = value;
        existing.teamName = teamName;
        await existing.save();
      }
    } else {
      await Vote.create({ messageId, userId: req.user._id, teamName, value });
    }

    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ message: 'Message not found' });

    msg.votes = (msg.votes || 0) + delta;
    await msg.save();

    // Update debate team totalVotes snapshot if debateId provided
    if (debateId) {
      const debate = await Debate.findById(debateId);
      if (debate) {
        const team = debate.teams.find((t) => t.name === msg.teamName);
        if (team) {
          team.totalVotes = (team.totalVotes || 0) + delta;
          await debate.save();
        }
      }
    }

    res.json({ messageId, votes: msg.votes, delta });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Duplicate vote' });
    res.status(500).json({ message: err.message });
  }
};

export const getMessageVotes = async (req, res) => {
  try {
    const { messageId } = req.params;
    const votes = await Vote.find({ messageId });
    res.json(votes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDebateVotes = async (req, res) => {
  try {
    const { debateId } = req.params;
    // Aggregate by messages in debate
    const messages = await Message.find({ debateId });
    const totals = { 'Team A': 0, 'Team B': 0 };
    messages.forEach((m) => {
      totals[m.teamName] += m.votes || 0;
    });
    res.json(totals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
