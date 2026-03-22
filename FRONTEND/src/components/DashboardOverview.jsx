import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Calendar, Lightbulb, FolderKanban, Award } from 'lucide-react';
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

export default function DashboardOverview() {
  const [stats, setStats] = useState({ events: 0, ideas: 0, projects: 0, certificates: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const userId = (() => {
          try {
            const userStr = localStorage.getItem('user');
            if (userStr && userStr !== 'undefined') return JSON.parse(userStr)?.id;
          } catch {}
          return null;
        })();
        const [eventsRes, ideasRes, projectsRes, certsRes] = await Promise.all([
          api.get('/api/events'),
          api.get('/api/ideas/my'),
          api.get('/api/projects/my'),
          api.get('/api/certificates'),
        ]);
        const events = eventsRes.data || [];
        const myEvents = events.filter((e) =>
          e.registeredUsers?.some((u) =>
            String(typeof u === 'object' ? u._id : u) === String(userId)
          )
        );
        setStats({
          events: myEvents.length,
          ideas: ideasRes.data?.length || 0,
          projects: projectsRes.data?.length || 0,
          certificates: certsRes.data?.length || 0,
        });
      } catch {
        setStats({ events: 0, ideas: 0, projects: 0, certificates: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Registered Events', value: stats.events, icon: Calendar, color: '#7c3aed' },
    { label: 'Ideas Submitted', value: stats.ideas, icon: Lightbulb, color: '#22d3ee' },
    { label: 'Projects Created', value: stats.projects, icon: FolderKanban, color: '#3b82f6' },
    { label: 'Certificates Earned', value: stats.certificates, icon: Award, color: '#10b981' },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <StatCard key={card.label} card={card} loading={loading} index={i} />
        ))}
      </div>
    </div>
  );
}
