import User from '../models/User.js';
import Project from '../models/Project.js';
import Idea from '../models/Idea.js';
import Event from '../models/Event.js';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpiry');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, mobile, course, branch, year, section } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (course) user.course = course;
    if (branch) user.branch = branch;
    if (year) user.year = year;
    if (section) user.section = section;
    if (req.file?.buffer) {
      user.profileImage = await uploadBufferToCloudinary(req.file.buffer, 'iic-innovation/profiles');
    }
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ isVerified: true, role: 'student', isSuspended: { $ne: true } }).select('name email profileImage');
    const projects = await Project.aggregate([{ $group: { _id: '$studentId', count: { $sum: 1 } } }]);
    const ideas = await Idea.aggregate([{ $group: { _id: '$studentId', count: { $sum: 1 } } }]);
    const eventsReg = await Event.aggregate([
      { $unwind: '$registeredUsers' },
      { $group: { _id: '$registeredUsers', count: { $sum: 1 } } },
    ]);

    const scoreMap = {};
    users.forEach((u) => {
      scoreMap[u._id.toString()] = {
        user: { id: u._id, name: u.name, email: u.email, profileImage: u.profileImage },
        ideas: 0,
        projects: 0,
        events: 0,
        total: 0,
      };
    });
    projects.forEach((p) => {
      const id = p._id.toString();
      if (scoreMap[id]) {
        scoreMap[id].projects = p.count;
      }
    });
    ideas.forEach((i) => {
      const id = i._id.toString();
      if (scoreMap[id]) {
        scoreMap[id].ideas = i.count;
      }
    });
    eventsReg.forEach((e) => {
      const id = e._id.toString();
      if (scoreMap[id]) {
        scoreMap[id].events = e.count;
      }
    });

    const leaderboard = Object.values(scoreMap)
      .map((s) => ({ ...s, total: s.ideas * 2 + s.projects * 3 + s.events }))
      .sort((a, b) => b.total - a.total)
      .map((s, i) => ({ ...s, rank: i + 1 }));

    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
};
