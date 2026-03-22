import express from 'express';
import { requestSession, getMySessions } from '../controllers/mentorshipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request', protect, requestSession);
router.get('/sessions', protect, getMySessions);

export default router;
