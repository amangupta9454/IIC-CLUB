import Hackathon from '../models/Hackathon.js';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

export const createHackathon = async (req, res, next) => {
  try {
    const { hackathonName, projectTitle, teamMembers, githubLink, demoVideo } = req.body;
    if (!hackathonName || !projectTitle) {
      res.status(400);
      throw new Error('Hackathon name and project title required');
    }
    let presentationFile = '';
    if (req.file?.buffer) {
      presentationFile = await uploadBufferToCloudinary(req.file.buffer, 'iic-innovation/hackathons', 'raw');
    }
    const members = typeof teamMembers === 'string' ? teamMembers.split(',').map((m) => m.trim()) : teamMembers || [];
    const hackathon = await Hackathon.create({
      hackathonName,
      projectTitle,
      teamMembers: members,
      githubLink: githubLink || '',
      presentationFile,
      demoVideo: demoVideo || '',
      studentId: req.user._id,
    });
    res.status(201).json(hackathon);
  } catch (error) {
    next(error);
  }
};

export const getMyHackathons = async (req, res, next) => {
  try {
    const hackathons = await Hackathon.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(hackathons);
  } catch (error) {
    next(error);
  }
};
