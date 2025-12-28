import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { sendMessage, getMessages } from '../controllers/messageController.js';

const router = express.Router();

router.post('/:debateId', protect, sendMessage);
router.get('/:debateId', protect, getMessages);

export default router;
