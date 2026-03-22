import Idea from '../models/Idea.js';

export const createIdea = async (req, res, next) => {
  try {
    const { ideaTitle, problemStatement, proposedSolution, technologyUsed, prototypeLink, githubLink } = req.body;
    if (!ideaTitle || !problemStatement || !proposedSolution) {
      res.status(400);
      throw new Error('Idea title, problem statement and proposed solution required');
    }
    const idea = await Idea.create({
      ideaTitle,
      problemStatement,
      proposedSolution,
      technologyUsed: technologyUsed || '',
      prototypeLink: prototypeLink || '',
      githubLink: githubLink || '',
      studentId: req.user._id,
    });
    res.status(201).json(idea);
  } catch (error) {
    next(error);
  }
};

export const getMyIdeas = async (req, res, next) => {
  try {
    const ideas = await Idea.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    next(error);
  }
};
