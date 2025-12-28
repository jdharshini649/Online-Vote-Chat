import { Message } from '../models/messageModel.js';
import { Vote } from '../models/voteModel.js';
import { Debate } from '../models/debateModel.js';
import { getRoomName, DebateTimers } from '../utils/socketUtils.js';

const timers = new DebateTimers();

export const registerDebateSocket = (io) => {
  io.on('connection', (socket) => {
    // join debate room
    socket.on('join_debate', async ({ debateId, username, teamName }) => {
      try {
        const room = getRoomName(debateId);
        socket.join(room);
        io.to(room).emit('user_joined', { username, teamName });

        // After a user joins the socket room, broadcast the latest debate
        // document so connected clients can refresh their UI (e.g. member counts).
        try {
          const debate = await Debate.findById(debateId);
          if (debate) {
            io.to(room).emit('debate_updated', debate);
          }
        } catch (e) {
          console.error('Failed to fetch debate after join_debate:', e);
        }
      } catch (err) {
        console.error('join_debate error', err);
      }
    });

    // send message
    socket.on('send_message', async ({ debateId, userId, teamName, content }) => {
      try {
        if (!['Team A', 'Team B'].includes(teamName)) return;
        const message = await Message.create({ debateId, senderId: userId, teamName, content });
        const room = getRoomName(debateId);
        io.to(room).emit('new_message', message);
      } catch (err) {
        console.error('send_message error', err);
      }
    });

    // vote message
    socket.on('vote_message', async ({ messageId, userId, teamName, value, debateId }) => {
      try {
        if (![1, -1].includes(value)) return;
        if (!['Team A', 'Team B'].includes(teamName)) return;
        let delta = value;
        const existing = await Vote.findOne({ messageId, userId });
        if (existing) {
          if (existing.value === value) {
            delta = 0;
          } else {
            delta = value - existing.value;
            existing.value = value;
            existing.teamName = teamName;
            await existing.save();
          }
        } else {
          await Vote.create({ messageId, userId, teamName, value });
        }

        if (delta !== 0) {
          const msg = await Message.findById(messageId);
          if (msg) {
            msg.votes = (msg.votes || 0) + delta;
            await msg.save();
            const room = getRoomName(debateId || msg.debateId);
            io.to(room).emit('vote_update', { messageId, value: msg.votes });

            // Update debate team total votes snapshot
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
          }
        }
      } catch (err) {
        console.error('vote_message error', err);
      }
    });

    // start debate timer
    socket.on('start_debate_timer', async ({ debateId }) => {
      try {
        if (timers.has(debateId)) return; // already running
        const debate = await Debate.findById(debateId);
        if (!debate) return;
        const duration = (debate.duration || 10) * 60 * 1000;
  const room = getRoomName(debateId);
  // send the official endTime so clients can sync timers (prevents restart on refresh)
  io.to(room).emit('timer_start', { endTime: debate.endTime || new Date(Date.now() + duration) });

        const timeoutId = setTimeout(async () => {
          try {
            const messages = await Message.find({ debateId });
            const teamVotes = { 'Team A': 0, 'Team B': 0 };
            messages.forEach((m) => {
              teamVotes[m.teamName] += m.votes || 0;
            });

            let winner = null;
            if (teamVotes['Team A'] > teamVotes['Team B']) winner = 'Team A';
            else if (teamVotes['Team B'] > teamVotes['Team A']) winner = 'Team B';

            const d = await Debate.findById(debateId);
            if (d) {
              d.status = 'ended';
              d.endTime = new Date();
              d.winnerTeam = winner;
              d.teams = d.teams.map((t) => ({ ...t.toObject(), totalVotes: teamVotes[t.name] || 0 }));
              await d.save();
            }

            io.to(room).emit('debate_ended', { winnerTeam: winner });
          } catch (err) {
            console.error('auto end debate error', err);
          } finally {
            timers.clear(debateId);
          }
        }, duration);
        timers.set(debateId, timeoutId);
      } catch (err) {
        console.error('start_debate_timer error', err);
      }
    });

    socket.on('disconnect', () => {
      // no-op for now
    });
  });
};
