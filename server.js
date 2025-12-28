import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import debateRoutes from './routes/debateRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import voteRoutes from './routes/voteRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { registerDebateSocket } from './sockets/debateSocket.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Health endpoint (public)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Connect DB
connectDB();

// Routes (protected inside individual routers)
app.use('/api/auth', authRoutes);
app.use('/api/debates', debateRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/votes', voteRoutes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH'] },
});

// Make io available on the Express app so controllers can emit events when
// server-side REST handlers change debate state.
app.set('io', io);

registerDebateSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
