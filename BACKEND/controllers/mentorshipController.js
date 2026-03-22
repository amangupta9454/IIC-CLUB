import Mentorship from '../models/Mentorship.js';

export const requestSession = async (req, res, next) => {
  try {
    const { question, mentorName } = req.body;
    if (!question) {
      res.status(400);
      throw new Error('Question required');
    }
    const session = await Mentorship.create({
      studentId: req.user._id,
      mentorName: mentorName || '',
      question,
      status: 'pending',
    });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

export const getMySessions = async (req, res, next) => {
  try {
    const sessions = await Mentorship.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};
