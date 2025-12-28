import { Message } from '../models/messageModel.js';
import { Debate } from '../models/debateModel.js';

export const sendMessage = async (req, res) => {
  try {
    const { debateId } = req.params;
    const { content, teamName } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });
    if (!['Team A', 'Team B'].includes(teamName)) return res.status(400).json({ message: 'Invalid team name' });

    const debate = await Debate.findById(debateId);
    if (!debate) return res.status(404).json({ message: 'Debate not found' });
    if (debate.status !== 'live') return res.status(400).json({ message: 'Debate is not live' });

    const message = await Message.create({
      debateId,
      senderId: req.user._id,
      teamName,
      content,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { debateId } = req.params;
    const messages = await Message.find({ debateId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
