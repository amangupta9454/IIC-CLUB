import express from 'express';
import { getEvents, registerForEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/register', protect, registerForEvent);

export default router;
