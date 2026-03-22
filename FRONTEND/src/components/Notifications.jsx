import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check } from 'lucide-react';
import api from '../utils/api.js';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/notifications').then(({ data }) => setNotifications(data)).catch(() => setNotifications([])).finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch {}
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleString('en-IN') : '');

  if (loading) return <div className="text-slate-400">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
        Notifications
      </h1>
      {notifications.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-12 text-center text-slate-400">
          <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
          No notifications
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`rounded-xl border p-4 flex items-start justify-between gap-4 ${
                n.read ? 'border-white/5 bg-[rgba(255,255,255,0.02)]' : 'border-[#7c3aed]/20 bg-[#7c3aed]/5'
              }`}
            >
              <div>
                <h3 className="font-medium mb-1">{n.title}</h3>
                <p className="text-slate-400 text-sm">{n.message}</p>
                <p className="text-slate-500 text-xs mt-2">{formatDate(n.createdAt)}</p>
              </div>
              {!n.read && (
                <button
                  onClick={() => markRead(n._id)}
                  className="shrink-0 p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-[#7c3aed] transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
