import express from 'express';
import { createIdea, getMyIdeas } from '../controllers/ideaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createIdea);
router.get('/my', protect, getMyIdeas);

export default router;
