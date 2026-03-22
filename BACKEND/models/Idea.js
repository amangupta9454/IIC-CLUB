import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema(
  {
    ideaTitle: { type: String, required: true },
    problemStatement: { type: String, required: true },
    proposedSolution: { type: String, required: true },
    technologyUsed: { type: String, default: '' },
    prototypeLink: { type: String, default: '' },
    githubLink: { type: String, default: '' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'incubated'], default: 'pending' },
    adminFeedback: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Idea', ideaSchema);
