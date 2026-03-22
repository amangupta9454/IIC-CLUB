import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send } from 'lucide-react';
import api from '../utils/api.js';

export default function NotificationsManagement() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const { data } = await api.post('/api/admin/notifications', { title, message, targetAudience });
      setResult(data);
      setTitle('');
      setMessage('');
    } catch (err) {
      setResult({ error: err.response?.data?.message || 'Failed to send' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent"
      >
        Send Announcement
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-6 max-w-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-6 h-6 text-[#7c3aed]" />
          <h2 className="font-semibold">New Notification</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
              placeholder="Announcement title"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none resize-none"
              rows={4}
              placeholder="Message content..."
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Target audience</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
            >
              <option value="all">All students</option>
            </select>
          </div>
          {result && (
            <div className={`p-3 rounded-lg text-sm ${result.error ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
              {result.error || (result.count !== undefined ? `Sent to ${result.count} students.` : 'Sent.')}
            </div>
          )}
          <button
            type="submit"
            disabled={sending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
