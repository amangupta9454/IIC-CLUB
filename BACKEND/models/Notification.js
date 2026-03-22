import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['idea', 'event', 'mentor', 'hackathon', 'general'], default: 'general' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    targetAudience: { type: String, default: 'all' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
