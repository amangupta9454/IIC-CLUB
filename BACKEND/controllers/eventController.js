import Event from '../models/Event.js';

export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate('registeredUsers', 'name email');
    res.json(events);
  } catch (error) {
    next(error);
  }
};

export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    if (!eventId) {
      res.status(400);
      throw new Error('Event ID required');
    }
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
    const isRegistered = event.registeredUsers.some(
      (id) => id && id.toString() === req.user._id.toString()
    );
    if (isRegistered) {
      res.status(400);
      throw new Error('Already registered');
    }
    event.registeredUsers.push(req.user._id);
    await event.save();
    res.json(event);
  } catch (error) {
    next(error);
  }
};
