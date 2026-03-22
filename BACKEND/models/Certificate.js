import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certificateTitle: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    eventName: { type: String, default: '' },
    certificateFile: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Certificate', certificateSchema);
