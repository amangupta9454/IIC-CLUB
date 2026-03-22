import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, default: 'link' },
  },
  { timestamps: true }
);

export default mongoose.model('Resource', resourceSchema);
