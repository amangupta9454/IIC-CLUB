import Notification from '../models/Notification.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findOne({ _id: id, studentId: req.user._id });
    if (!notif) {
      res.status(404);
      throw new Error('Notification not found');
    }
    notif.read = true;
    await notif.save();
    res.json(notif);
  } catch (error) {
    next(error);
  }
};
