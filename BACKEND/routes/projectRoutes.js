import express from 'express';
import { createProject, getMyProjects } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadMultiple } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, uploadMultiple('images', 5), createProject);
router.get('/my', protect, getMyProjects);

export default router;
