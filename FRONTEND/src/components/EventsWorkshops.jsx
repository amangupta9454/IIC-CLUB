import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, UserPlus } from 'lucide-react';
import api from '../utils/api.js';

export default function EventsWorkshops() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = (() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'undefined') return JSON.parse(userStr);
    } catch {}
    return {};
  })();

  useEffect(() => {
    api.get('/api/events').then(({ data }) => setEvents(data)).finally(() => setLoading(false));
  }, []);

  const isRegistered = (event) =>
    event.registeredUsers?.some((u) => (typeof u === 'object' ? u._id : u)?.toString() === user?.id?.toString());

  const handleRegister = async (eventId) => {
    try {
      await api.post('/api/events/register', { eventId });
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId
            ? { ...e, registeredUsers: [...(e.registeredUsers || []), { _id: user.id }] }
            : e
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : '');

  if (loading) return <div className="text-slate-400">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
        Events & Workshops
      </h1>
      <div className="grid gap-6">
        {events.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-12 text-center text-slate-400">
            No events available
          </div>
        ) : (
          events.map((event, i) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-6 hover:border-[#7c3aed]/30 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.venue}
                    </span>
                  </div>
                </div>
                <div>
                  {isRegistered(event) ? (
                    <span className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm">
                      Registered
                    </span>
                  ) : (
                    <motion.button
                      onClick={() => handleRegister(event._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] font-medium"
                    >
                      <UserPlus className="w-4 h-4" />
                      Register
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
