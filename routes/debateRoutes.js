import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createDebate, getAllDebates, getDebateById, joinDebate, startDebate, endDebate } from '../controllers/debateController.js';

const router = express.Router();

router.post('/create', protect, createDebate);
router.get('/', protect, getAllDebates);
router.get('/:id', protect, getDebateById);
router.post('/:id/join', protect, joinDebate);
router.patch('/:id/start', protect, startDebate);
// Manual ending via API is disabled to ensure debates only close via the timer.

export default router;
