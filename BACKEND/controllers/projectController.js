import Project from '../models/Project.js';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

export const createProject = async (req, res, next) => {
  try {
    const { title, description, techStack, githubLink, demoLink } = req.body;
    if (!title || !description) {
      res.status(400);
      throw new Error('Title and description required');
    }
    let images = [];
    if (req.files?.length) {
      for (const f of req.files) {
        const url = await uploadBufferToCloudinary(f.buffer);
        images.push(url);
      }
    }
    const techArr = typeof techStack === 'string' ? techStack.split(',').map((t) => t.trim()) : techStack || [];
    const project = await Project.create({
      title,
      description,
      techStack: techArr,
      githubLink: githubLink || '',
      demoLink: demoLink || '',
      images,
      studentId: req.user._id,
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};
