import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP, getOTPExpiry } from '../utils/generateOTP.js';
import { sendOTPEmail } from '../utils/sendEmail.js';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const register = async (req, res, next) => {
  try {
    const { name, email, password, mobile, course, branch, year, section, profileImage } = req.body;
    if (!name || !email || !password || !mobile || !course || !branch || !year || !section) {
      res.status(400);
      throw new Error('Please fill all required fields');
    }
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error('User already exists');
    }
    let profileImageUrl = profileImage || '';
    if (req.file?.buffer) {
      profileImageUrl = await uploadBufferToCloudinary(req.file.buffer, 'iic-innovation/profiles');
    }
    const otp = generateOTP(6);
    const otpExpiry = getOTPExpiry(10);
    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      mobile,
      course,
      branch,
      year,
      section,
      profileImage: profileImageUrl,
      otp,
      otpExpiry,
    });
    await sendOTPEmail(email, otp);
    res.status(201).json({
      message: 'OTP sent to email',
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400);
      throw new Error('Email and OTP required');
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    if (user.otp !== otp) {
      res.status(400);
      throw new Error('Invalid OTP');
    }
    if (new Date() > user.otpExpiry) {
      res.status(400);
      throw new Error('OTP expired');
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password required');
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }
    const match = await user.matchPassword(password);
    if (!match) {
      res.status(401);
      throw new Error('Invalid credentials');
    }
    if (!user.isVerified) {
      res.status(403);
      throw new Error('Please verify your email first');
    }
    if (user.isSuspended) {
      res.status(403);
      throw new Error('Account suspended. Contact admin.');
    }
    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        course: user.course,
        branch: user.branch,
        year: user.year,
        section: user.section,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error('Email required');
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    const otp = generateOTP(6);
    user.otp = otp;
    user.otpExpiry = getOTPExpiry(10);
    await user.save();
    await sendOTPEmail(email, otp);
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      res.status(400);
      throw new Error('Email, OTP and new password required');
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    if (user.otp !== otp) {
      res.status(400);
      throw new Error('Invalid OTP');
    }
    if (new Date() > user.otpExpiry) {
      res.status(400);
      throw new Error('OTP expired');
    }
    user.password = newPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};
