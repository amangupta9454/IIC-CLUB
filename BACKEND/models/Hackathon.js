import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema(
  {
    hackathonName: { type: String, required: true },
    projectTitle: { type: String, required: true },
    teamMembers: [{ type: String }],
    githubLink: { type: String, default: '' },
    presentationFile: { type: String, default: '' },
    demoVideo: { type: String, default: '' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Hackathon', hackathonSchema);
