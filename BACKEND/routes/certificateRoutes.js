import express from 'express';
import { getMyCertificates, uploadCertificate } from '../controllers/certificateController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyCertificates);
router.post('/', protect, uploadSingle('certificateFile'), uploadCertificate);

export default router;
