import express from 'express';
import {
  adminLogin,
  getDashboardStats,
  getStudents,
  getStudent,
  suspendStudent,
  activateStudent,
  deleteStudent,
  getEventsAdmin,
  getEventAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
  getIdeasAdmin,
  updateIdeaStatus,
  getProjectsAdmin,
  updateProjectStatus,
  setProjectFeatured,
  getHackathonsAdmin,
  createHackathonAdmin,
  updateHackathonAdmin,
  getMentorshipRequests,
  assignMentor,
  updateMentorshipStatus,
  scheduleMentorship,
  getCertificatesAdmin,
  approveCertificate,
  rejectCertificate,
  generateCertificate,
  createAnnouncement,
  getAnalytics,
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/adminController.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/login', adminLogin);

router.use(adminOnly);

router.get('/dashboard/stats', getDashboardStats);

router.get('/students', getStudents);
router.get('/students/:id', getStudent);
router.put('/students/:id/suspend', suspendStudent);
router.put('/students/:id/activate', activateStudent);
router.delete('/students/:id', deleteStudent);

router.get('/events', getEventsAdmin);
router.get('/events/:id', getEventAdmin);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

router.get('/ideas', getIdeasAdmin);
router.put('/ideas/:id/status', updateIdeaStatus);

router.get('/projects', getProjectsAdmin);
router.put('/projects/:id/status', updateProjectStatus);
router.put('/projects/:id/featured', setProjectFeatured);

router.get('/hackathons', getHackathonsAdmin);
router.post('/hackathons', createHackathonAdmin);
router.put('/hackathons/:id', updateHackathonAdmin);

router.get('/mentorship', getMentorshipRequests);
router.put('/mentorship/:id/mentor', assignMentor);
router.put('/mentorship/:id/status', updateMentorshipStatus);
router.put('/mentorship/:id/schedule', scheduleMentorship);

router.get('/certificates', getCertificatesAdmin);
router.put('/certificates/:id/approve', approveCertificate);
router.put('/certificates/:id/reject', rejectCertificate);
router.post('/certificates/generate', generateCertificate);

router.post('/notifications', createAnnouncement);

router.get('/analytics', getAnalytics);

router.get('/resources', getResources);
router.post('/resources', createResource);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);

export default router;
