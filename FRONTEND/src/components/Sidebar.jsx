import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  Calendar,
  Lightbulb,
  FolderKanban,
  Trophy,
  BookOpen,
  Users,
  Award,
  BarChart3,
  Bell,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard Overview' },
  { path: '/dashboard/profile', icon: User, label: 'My Profile' },
  { path: '/dashboard/events', icon: Calendar, label: 'Events & Workshops' },
  { path: '/dashboard/ideas', icon: Lightbulb, label: 'Submit Innovation Idea' },
  { path: '/dashboard/projects', icon: FolderKanban, label: 'My Projects' },
  { path: '/dashboard/hackathons', icon: Trophy, label: 'Hackathon Submissions' },
  { path: '/dashboard/resources', icon: BookOpen, label: 'Learning Resources' },
  { path: '/dashboard/mentorship', icon: Users, label: 'Mentorship' },
  { path: '/dashboard/certificates', icon: Award, label: 'Certificates' },
  { path: '/dashboard/leaderboard', icon: BarChart3, label: 'Leaderboard' },
  { path: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0f172a] border border-white/10"
      >
        <Menu className="w-6 h-6" />
      </button>
      <AnimatePresence>
        {open && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      <motion.aside
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 min-h-screen border-r border-white/10 bg-[#0f172a]/95 backdrop-blur-xl flex flex-col transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-[#7c3aed]" />
          <span className="font-bold text-lg bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
            IIC Platform
          </span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#7c3aed]/20 text-[#7c3aed] border border-[#7c3aed]/30 shadow-[0_0_20px_rgba(124,58,237,0.2)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </motion.aside>
    </>
  );
}
