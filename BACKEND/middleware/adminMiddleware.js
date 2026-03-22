import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const adminOnly = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    res.status(401);
    return next(new Error('Not authorized'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -otp -otpExpiry');
    if (!user || user.role !== 'admin') {
      res.status(403);
      return next(new Error('Admin access required'));
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    return next(new Error('Not authorized'));
  }
};
