import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

const Login = lazy(() => import('./components/Login.jsx'));
const Signup = lazy(() => import('./components/Signup.jsx'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword.jsx'));
const StudentDashboard = lazy(() => import('./components/StudentDashboard.jsx'));
const DashboardOverview = lazy(() => import('./components/DashboardOverview.jsx'));
const MyProfile = lazy(() => import('./components/MyProfile.jsx'));
const EventsWorkshops = lazy(() => import('./components/EventsWorkshops.jsx'));
const InnovationIdea = lazy(() => import('./components/InnovationIdea.jsx'));
const ProjectSubmission = lazy(() => import('./components/ProjectSubmission.jsx'));
const HackathonDetails = lazy(() => import('./components/HackathonDetails.jsx'));
const LearningResources = lazy(() => import('./components/LearningResources.jsx'));
const Mentorship = lazy(() => import('./components/Mentorship.jsx'));
const Certificates = lazy(() => import('./components/Certificates.jsx'));
const Leaderboard = lazy(() => import('./components/Leaderboard.jsx'));
const Notifications = lazy(() => import('./components/Notifications.jsx'));

const AdminLogin = lazy(() => import('./components/AdminLogin.jsx'));
const AdminLayout = lazy(() => import('./components/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard.jsx'));
const StudentManagement = lazy(() => import('./components/StudentManagement.jsx'));
const EventManagement = lazy(() => import('./components/EventManagement.jsx'));
const IdeaModeration = lazy(() => import('./components/IdeaModeration.jsx'));
const ProjectModeration = lazy(() => import('./components/ProjectModeration.jsx'));
const HackathonManagement = lazy(() => import('./components/HackathonManagement.jsx'));
const MentorshipManagement = lazy(() => import('./components/MentorshipManagement.jsx'));
const CertificateManagement = lazy(() => import('./components/CertificateManagement.jsx'));
const NotificationsManagement = lazy(() => import('./components/NotificationsManagement.jsx'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard.jsx'));
const LearningResourcesAdmin = lazy(() => import('./components/LearningResourcesAdmin.jsx'));

// Landing Pages
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const Teams = lazy(() => import('./pages/Teams.jsx'));
const WhatWeDo = lazy(() => import('./pages/WhatWeDo.jsx'));

const Navbar = lazy(() => import('./components/Navbar.jsx'));
const Footer = lazy(() => import('./components/Footer.jsx'));

const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow"> {/* PT-20 corresponds to Navbar height to prevent overlap */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

const NavbarLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') user = JSON.parse(userStr);
  } catch {}
  if (!token || user?.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
};

function PageLoader() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 border-2 border-[#7c3aed] border-t-transparent rounded-full"
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Landing Pages wrapped in PublicLayout */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/events-public" element={<PublicLayout><Events /></PublicLayout>} />
          <Route path="/teams" element={<PublicLayout><Teams /></PublicLayout>} />
          <Route path="/what-we-do" element={<PublicLayout><WhatWeDo /></PublicLayout>} />

          {/* Independent Auth Pages */}
          <Route path="/login" element={<NavbarLayout><Login /></NavbarLayout>} />
          <Route path="/signup" element={<NavbarLayout><Signup /></NavbarLayout>} />
          <Route path="/forgot-password" element={<NavbarLayout><ForgotPassword /></NavbarLayout>} />
          <Route path="/admin/login" element={<NavbarLayout><AdminLogin /></NavbarLayout>} />

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <NavbarLayout>
                  <AdminLayout />
                </NavbarLayout>
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="ideas" element={<IdeaModeration />} />
            <Route path="projects" element={<ProjectModeration />} />
            <Route path="hackathons" element={<HackathonManagement />} />
            <Route path="mentorship" element={<MentorshipManagement />} />
            <Route path="certificates" element={<CertificateManagement />} />
            <Route path="resources" element={<LearningResourcesAdmin />} />
            <Route path="notifications" element={<NotificationsManagement />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
          </Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <NavbarLayout>
                  <StudentDashboard />
                </NavbarLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="events" element={<EventsWorkshops />} />
            <Route path="ideas" element={<InnovationIdea />} />
            <Route path="projects" element={<ProjectSubmission />} />
            <Route path="hackathons" element={<HackathonDetails />} />
            <Route path="resources" element={<LearningResources />} />
            <Route path="mentorship" element={<Mentorship />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
