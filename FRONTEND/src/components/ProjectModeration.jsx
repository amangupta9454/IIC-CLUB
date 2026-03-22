import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Check, X, Star } from 'lucide-react';
import api from '../utils/api.js';

const statusColors = { pending: 'bg-amber-500/20 text-amber-400', approved: 'bg-green-500/20 text-green-400', rejected: 'bg-red-500/20 text-red-400' };

export default function ProjectModeration() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  async function fetchProjects() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/projects', { params: filter ? { status: filter } : {} });
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  async function setStatus(id, status) {
    setActionLoading(id);
    try {
      await api.put(`/api/admin/projects/${id}/status`, { status });
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setActionLoading(null);
    }
  }

  async function setFeatured(id, isFeatured) {
    setActionLoading(id);
    try {
      await api.put(`/api/admin/projects/${id}/featured`, { isFeatured });
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent"
      >
        Project Submissions Moderation
      </motion.h1>
      <div className="mb-6 flex gap-2 flex-wrap">
        {['', 'pending', 'approved', 'rejected'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm ${!filter && !s ? 'bg-[#7c3aed]/30 text-[#7c3aed]' : filter === s ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'}`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-slate-400 py-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj) => (
            <motion.div
              key={proj._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-4 hover:border-[#7c3aed]/30 transition"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FolderKanban className="w-5 h-5 text-[#3b82f6]" />
                    <h3 className="font-semibold">{proj.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${statusColors[proj.status] || ''}`}>
                      {proj.status}
                    </span>
                    {proj.isFeatured && (
                      <span className="px-2 py-0.5 rounded text-xs bg-[#f59e0b]/20 text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">By: {proj.studentId?.name || proj.studentId?.email || '—'}</p>
                  <p className="text-slate-500 text-sm line-clamp-2 mt-1">{proj.description}</p>
                </div>
                <div className="flex gap-2">
                  {proj.status === 'pending' && (
                    <>
                      <button
                        onClick={() => setStatus(proj._id, 'approved')}
                        disabled={actionLoading === proj._id}
                        className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setStatus(proj._id, 'rejected')}
                        disabled={actionLoading === proj._id}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setFeatured(proj._id, !proj.isFeatured)}
                    disabled={actionLoading === proj._id}
                    className={`p-2 rounded-lg ${proj.isFeatured ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-slate-400 hover:text-amber-400'}`}
                    title={proj.isFeatured ? 'Unfeature' : 'Feature'}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <div className="p-8 text-center text-slate-500 rounded-xl border border-white/10">No projects found.</div>
          )}
        </div>
      )}
    </div>
  );
}
