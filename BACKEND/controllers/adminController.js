import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Idea from '../models/Idea.js';
import Project from '../models/Project.js';
import Hackathon from '../models/Hackathon.js';
import Mentorship from '../models/Mentorship.js';
import Certificate from '../models/Certificate.js';
import Notification from '../models/Notification.js';
import Resource from '../models/Resource.js';
import { sendAdminLoginAlert } from '../utils/sendEmail.js';

const generateAdminToken = (id) =>
  jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password required');
    }
    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }
    const match = await user.matchPassword(password);
    if (!match) {
      res.status(401);
      throw new Error('Invalid credentials');
    }
    const loginTime = new Date().toISOString();
    const ip = req.ip || req.socket?.remoteAddress || '';
    try {
      await sendAdminLoginAlert(email, loginTime, ip);
    } catch (emailErr) {
      // Log but don't fail login
    }
    res.json({
      token: generateAdminToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [students, events, ideas, projects, hackathons, mentorshipRequests] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Event.countDocuments(),
      Idea.countDocuments(),
      Project.countDocuments(),
      Hackathon.countDocuments(),
      Mentorship.countDocuments(),
    ]);
    res.json({
      students,
      events,
      ideas,
      projects,
      hackathons,
      mentorshipRequests,
    });
  } catch (error) {
    next(error);
  }
};

// --- Students ---
export const getStudents = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = { role: 'student' };
    if (search && search.trim()) {
      const re = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: re }, { email: re }];
    }
    const students = await User.find(filter).select('-password -otp -otpExpiry').sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    next(error);
  }
};

export const getStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid student ID');
    }
    const student = await User.findOne({ _id: id, role: 'student' }).select('-password -otp -otpExpiry').lean();
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    const certificates = await Certificate.find({ studentId: id }).sort({ createdAt: -1 });
    res.json({ ...student, certificates });
  } catch (error) {
    next(error);
  }
};

export const suspendStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid student ID');
    }
    const user = await User.findOne({ _id: id, role: 'student' });
    if (!user) {
      res.status(404);
      throw new Error('Student not found');
    }
    user.isSuspended = true;
    await user.save();
    res.json({ message: 'Student suspended', user: await User.findById(id).select('-password -otp -otpExpiry') });
  } catch (error) {
    next(error);
  }
};

export const activateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid student ID');
    }
    const user = await User.findOne({ _id: id, role: 'student' });
    if (!user) {
      res.status(404);
      throw new Error('Student not found');
    }
    user.isSuspended = false;
    await user.save();
    res.json({ message: 'Student activated', user: await User.findById(id).select('-password -otp -otpExpiry') });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid student ID');
    }
    const user = await User.findOne({ _id: id, role: 'student' });
    if (!user) {
      res.status(404);
      throw new Error('Student not found');
    }
    await User.findByIdAndDelete(id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    next(error);
  }
};

// --- Events ---
export const getEventsAdmin = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate('registeredUsers', 'name email');
    res.json(events);
  } catch (error) {
    next(error);
  }
};

export const getEventAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid event ID');
    }
    const event = await Event.findById(id).populate('registeredUsers', 'name email mobile course branch year');
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, venue, image, bannerImage, registrationDeadline, applyLink } = req.body;
    if (!title || !description || !date || !venue) {
      res.status(400);
      throw new Error('Title, description, date and venue required');
    }
    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      venue,
      image: image || '',
      bannerImage: bannerImage || '',
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
      applyLink: applyLink || '',
    });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, date, venue, image, bannerImage, registrationDeadline, applyLink } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid event ID');
    }
    const event = await Event.findById(id);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = new Date(date);
    if (venue !== undefined) event.venue = venue;
    if (image !== undefined) event.image = image;
    if (bannerImage !== undefined) event.bannerImage = bannerImage;
    if (registrationDeadline !== undefined) event.registrationDeadline = registrationDeadline ? new Date(registrationDeadline) : null;
    if (applyLink !== undefined) event.applyLink = applyLink;
    await event.save();
    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid event ID');
    }
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
    res.json({ message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};

// --- Ideas ---
export const getIdeasAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ['pending', 'approved', 'rejected', 'incubated'].includes(status)) filter.status = status;
    const ideas = await Idea.find(filter).populate('studentId', 'name email').sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    next(error);
  }
};

export const updateIdeaStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminFeedback } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid idea ID');
    }
    if (!['pending', 'approved', 'rejected', 'incubated'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }
    const idea = await Idea.findById(id);
    if (!idea) {
      res.status(404);
      throw new Error('Idea not found');
    }
    idea.status = status;
    if (adminFeedback !== undefined) idea.adminFeedback = adminFeedback;
    await idea.save();
    res.json(idea);
  } catch (error) {
    next(error);
  }
};

// --- Projects ---
export const getProjectsAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) filter.status = status;
    const projects = await Project.find(filter).populate('studentId', 'name email').sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const updateProjectStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid project ID');
    }
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }
    const project = await Project.findById(id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    project.status = status;
    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const setProjectFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid project ID');
    }
    const project = await Project.findById(id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    project.isFeatured = typeof isFeatured === 'boolean' ? isFeatured : true;
    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
};

// --- Hackathons ---
export const getHackathonsAdmin = async (req, res, next) => {
  try {
    const hackathons = await Hackathon.find().populate('studentId', 'name email').sort({ createdAt: -1 });
    res.json(hackathons);
  } catch (error) {
    next(error);
  }
};

export const createHackathonAdmin = async (req, res, next) => {
  try {
    const { hackathonName, projectTitle, teamMembers, githubLink, presentationFile, demoVideo, studentId } = req.body;
    if (!hackathonName) {
      res.status(400);
      throw new Error('Hackathon name required');
    }
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      res.status(400);
      throw new Error('Valid student ID required');
    }
    const members = typeof teamMembers === 'string' ? teamMembers.split(',').map((m) => m.trim()) : teamMembers || [];
    const hackathon = await Hackathon.create({
      hackathonName,
      projectTitle: projectTitle || '',
      teamMembers: members,
      githubLink: githubLink || '',
      presentationFile: presentationFile || '',
      demoVideo: demoVideo || '',
      studentId,
    });
    res.status(201).json(hackathon);
  } catch (error) {
    next(error);
  }
};

export const updateHackathonAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid hackathon ID');
    }
    const hackathon = await Hackathon.findById(id);
    if (!hackathon) {
      res.status(404);
      throw new Error('Hackathon submission not found');
    }
    if (status !== undefined && ['pending', 'approved', 'rejected'].includes(status)) hackathon.status = status;
    if (remarks !== undefined) hackathon.remarks = remarks;
    await hackathon.save();
    res.json(hackathon);
  } catch (error) {
    next(error);
  }
};

// --- Mentorship ---
export const getMentorshipRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ['pending', 'accepted', 'completed'].includes(status)) filter.status = status;
    const requests = await Mentorship.find(filter).populate('studentId', 'name email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

export const assignMentor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { mentorName, mentorDepartment, mentorSpecialization, mentorMobile, mentorEmail } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid request ID');
    }
    const mentorship = await Mentorship.findById(id);
    if (!mentorship) {
      res.status(404);
      throw new Error('Mentorship request not found');
    }
    mentorship.mentorName = mentorName || '';
    if (mentorDepartment !== undefined) mentorship.mentorDepartment = mentorDepartment;
    if (mentorSpecialization !== undefined) mentorship.mentorSpecialization = mentorSpecialization;
    if (mentorMobile !== undefined) mentorship.mentorMobile = mentorMobile;
    if (mentorEmail !== undefined) mentorship.mentorEmail = mentorEmail;
    await mentorship.save();
    res.json(mentorship);
  } catch (error) {
    next(error);
  }
};

export const updateMentorshipStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid request ID');
    }
    if (!['pending', 'accepted', 'completed'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }
    const mentorship = await Mentorship.findById(id);
    if (!mentorship) {
      res.status(404);
      throw new Error('Mentorship request not found');
    }
    mentorship.status = status;
    await mentorship.save();
    res.json(mentorship);
  } catch (error) {
    next(error);
  }
};

export const scheduleMentorship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { scheduledAt } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid request ID');
    }
    const mentorship = await Mentorship.findById(id);
    if (!mentorship) {
      res.status(404);
      throw new Error('Mentorship request not found');
    }
    mentorship.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    await mentorship.save();
    res.json(mentorship);
  } catch (error) {
    next(error);
  }
};

// --- Certificates ---
export const getCertificatesAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) filter.status = status;
    const certificates = await Certificate.find(filter).populate('studentId', 'name email').sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    next(error);
  }
};

export const approveCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid certificate ID');
    }
    const cert = await Certificate.findById(id);
    if (!cert) {
      res.status(404);
      throw new Error('Certificate not found');
    }
    cert.status = 'approved';
    await cert.save();
    res.json(cert);
  } catch (error) {
    next(error);
  }
};

export const rejectCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid certificate ID');
    }
    const cert = await Certificate.findById(id);
    if (!cert) {
      res.status(404);
      throw new Error('Certificate not found');
    }
    cert.status = 'rejected';
    await cert.save();
    res.json(cert);
  } catch (error) {
    next(error);
  }
};

export const generateCertificate = async (req, res, next) => {
  try {
    const { studentId, certificateTitle, eventName, certificateFile } = req.body;
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      res.status(400);
      throw new Error('Valid student ID required');
    }
    const cert = await Certificate.create({
      studentId,
      certificateTitle: certificateTitle || '',
      eventName: eventName || '',
      certificateFile: certificateFile || '',
      imageUrl: certificateFile || '',
      title: certificateTitle || '',
      status: 'approved',
    });
    res.status(201).json(cert);
  } catch (error) {
    next(error);
  }
};

// --- Notifications ---
export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, targetAudience } = req.body;
    if (!title || !message) {
      res.status(400);
      throw new Error('Title and message required');
    }
    const audience = targetAudience === 'all' ? 'all' : (targetAudience || 'all');
    if (audience === 'all') {
      const students = await User.find({ role: 'student' }).select('_id');
      const notifications = students.map((s) => ({
        title,
        message,
        type: 'general',
        studentId: s._id,
        targetAudience: 'all',
      }));
      await Notification.insertMany(notifications);
      res.status(201).json({ message: 'Announcement sent to all students', count: notifications.length });
    } else {
      const notif = await Notification.create({ title, message, type: 'general', targetAudience: audience });
      res.status(201).json(notif);
    }
  } catch (error) {
    next(error);
  }
};

// --- Analytics ---
export const getAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const studentRegistrations = await User.aggregate([
      { $match: { role: 'student', createdAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const ideasSubmitted = await Idea.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const projectsUploaded = await Project.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const eventParticipation = await Event.aggregate([
      { $unwind: '$registeredUsers' },
      { $group: { _id: '$registeredUsers', count: { $sum: 1 } } },
      { $count: 'totalRegistrations' },
    ]);
    res.json({
      studentRegistrations,
      ideasSubmitted,
      projectsUploaded,
      eventParticipation: eventParticipation[0]?.totalRegistrations || 0,
    });
  } catch (error) {
    next(error);
  }
};

// --- Learning Resources ---
export const getResources = async (req, res, next) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

export const createResource = async (req, res, next) => {
  try {
    const { title, link, description, type } = req.body;
    if (!title || !link) {
      res.status(400);
      throw new Error('Title and link required');
    }
    const resource = await Resource.create({
      title,
      link,
      description: description || '',
      type: type || 'link',
    });
    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, link, description, type } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid resource ID');
    }
    const resource = await Resource.findById(id);
    if (!resource) {
      res.status(404);
      throw new Error('Resource not found');
    }
    if (title !== undefined) resource.title = title;
    if (link !== undefined) resource.link = link;
    if (description !== undefined) resource.description = description;
    if (type !== undefined) resource.type = type;
    await resource.save();
    res.json(resource);
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid resource ID');
    }
    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) {
      res.status(404);
      throw new Error('Resource not found');
    }
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    next(error);
  }
};
