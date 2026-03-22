import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Users, Calendar, Lightbulb, FolderKanban, Trophy, MessageCircle } from 'lucide-react';
import api from '../utils/api.js';
import { useCursorTilt } from '../utils/useCursorTilt.js';

function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState(0);
  const spring = useSpring(0, { stiffness: 50, damping: 25 });
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  useEffect(() => {
    return spring.on('change', (v) => setDisplay(Math.round(v)));
  }, [spring]);
  return <span>{display}</span>;
}

function StatCard({ card, loading, index }) {
  const { ref, style } = useCursorTilt();
  const Icon = card.icon;
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] backdrop-blur p-6 hover:border-[#7c3aed]/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all"
    >
      <Icon className="w-10 h-10 mb-4" style={{ color: card.color }} />
      <p className="text-slate-400 text-sm mb-1">{card.label}</p>
      <p className="text-3xl font-bold">
        {loading ? '—' : <AnimatedCounter value={card.value} />}
      </p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    events: 0,
    ideas: 0,
    projects: 0,
    hackathons: 0,
    mentorshipRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await api.get('/api/admin/dashboard/stats');
        setStats(data);
      } catch {
        setStats({
          students: 0,
          events: 0,
          ideas: 0,
          projects: 0,
          hackathons: 0,
          mentorshipRequests: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Students', value: stats.students, icon: Users, color: '#7c3aed' },
    { label: 'Total Events', value: stats.events, icon: Calendar, color: '#3b82f6' },
    { label: 'Total Innovation Ideas', value: stats.ideas, icon: Lightbulb, color: '#22d3ee' },
    { label: 'Total Projects', value: stats.projects, icon: FolderKanban, color: '#10b981' },
    { label: 'Total Hackathon Submissions', value: stats.hackathons, icon: Trophy, color: '#f59e0b' },
    { label: 'Total Mentorship Requests', value: stats.mentorshipRequests, icon: MessageCircle, color: '#ec4899' },
  ];

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-8 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent"
      >
        Dashboard Overview
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <StatCard key={card.label} card={card} loading={loading} index={i} />
        ))}
      </div>
    </div>
  );
}
