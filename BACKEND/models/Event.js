import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    image: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    registrationDeadline: { type: Date, default: null },
    applyLink: { type: String, default: '' },
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
