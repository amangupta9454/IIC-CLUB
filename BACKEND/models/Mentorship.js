import mongoose from 'mongoose';

const mentorshipSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentorName: { type: String, default: '' },
    mentorDepartment: { type: String, default: '' },
    mentorSpecialization: { type: String, default: '' },
    mentorMobile: { type: String, default: '' },
    mentorEmail: { type: String, default: '' },
    question: { type: String, required: true },
    feedback: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
    scheduledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Mentorship', mentorshipSchema);
