import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { castVote, getMessageVotes, getDebateVotes } from '../controllers/voteController.js';

const router = express.Router();

router.post('/:messageId', protect, castVote);
router.get('/:messageId', protect, getMessageVotes);
router.get('/debate/:debateId', protect, getDebateVotes);

export default router;
