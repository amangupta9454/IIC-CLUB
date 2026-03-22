import express from 'express';
import { register, verifyOtp, login, forgotPassword, resetPassword } from '../controllers/authController.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', uploadSingle('profileImage'), register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
