import express from 'express';
import { createHackathon, getMyHackathons } from '../controllers/hackathonController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, uploadSingle('presentationFile'), createHackathon);
router.get('/my', protect, getMyHackathons);

export default router;
