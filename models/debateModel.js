import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, enum: ['Team A', 'Team B'], required: true },
    tName : {type : String, required : true},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    totalVotes: { type: Number, default: 0 },
  },
  { _id: false }
);

const debateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    teams: {
      type: [teamSchema],
      validate: {
        validator: function (arr) {
          if (!Array.isArray(arr) || arr.length !== 2) return false;
          const names = arr.map((t) => t.name).sort();
          return names[0] === 'Team A' && names[1] === 'Team B';
        },
        message: 'Debate must have exactly Team A and Team B',
      },
      default: undefined,
    },
    duration: { type: Number, default: 10 }, // minutes
    startTime: { type: Date },
    endTime: { type: Date },
    status: { type: String, enum: ['upcoming', 'live', 'ended'], default: 'upcoming' },
    winnerTeam: { type: String, enum: ['Team A', 'Team B', null], default: null },
  },
  { timestamps: true }
);

export const Debate = mongoose.model('Debate', debateSchema);
