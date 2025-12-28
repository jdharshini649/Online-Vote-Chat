import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    debateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Debate', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teamName: { type: String, enum: ['Team A', 'Team B'], required: true },
    content: { type: String, required: true },
    votes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
