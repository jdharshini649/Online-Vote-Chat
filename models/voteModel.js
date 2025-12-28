import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teamName: { type: String, enum: ['Team A', 'Team B'], required: true },
    value: { type: Number, enum: [1, -1], required: true },
  },
  { timestamps: true }
);

voteSchema.index({ messageId: 1, userId: 1 }, { unique: true });

export const Vote = mongoose.model('Vote', voteSchema);
