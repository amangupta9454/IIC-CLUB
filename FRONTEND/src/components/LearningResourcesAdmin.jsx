import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import api from '../utils/api.js';

export default function LearningResourcesAdmin() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: '', link: '', description: '', type: 'link' });
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/resources');
      setResources(data);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setModal('create');
    setForm({ title: '', link: '', description: '', type: 'link' });
  }

  function openEdit(r) {
    setModal('edit');
    setForm({
      id: r._id,
      title: r.title,
      link: r.link,
      description: r.description || '',
      type: r.type || 'link',
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/api/admin/resources', form);
      } else {
        await api.put(`/api/admin/resources/${form.id}`, form);
      }
      setModal(null);
      fetchResources();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  }

  async function deleteResource(id) {
    if (!confirm('Delete this resource?')) return;
    setActionLoading(id);
    try {
      await api.delete(`/api/admin/resources/${id}`);
      fetchResources();
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
        Learning Resources
      </motion.h1>
      <div className="mb-6 flex justify-end">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition"
        >
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      </div>
      {loading ? (
        <div className="text-slate-400 py-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {resources.map((r) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-4 flex items-center justify-between gap-4 hover:border-[#7c3aed]/30 transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <BookOpen className="w-8 h-8 text-[#7c3aed] shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="text-slate-400 text-sm truncate">{r.link}</p>
                  {r.description && <p className="text-slate-500 text-sm mt-1 line-clamp-1">{r.description}</p>}
                </div>
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/10 hover:bg-[#22d3ee]/20 text-[#22d3ee] shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(r)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-[#7c3aed]/20 text-[#7c3aed]"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteResource(r._id)}
                  disabled={actionLoading === r._id}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          {resources.length === 0 && (
            <div className="p-8 text-center text-slate-500 rounded-xl border border-white/10">No resources yet. Add one above.</div>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f172a] p-6"
          >
            <h2 className="text-xl font-bold mb-4">{modal === 'create' ? 'Add Resource' : 'Edit Resource'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Link</label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none resize-none"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 rounded-lg border border-white/20">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#7c3aed] disabled:opacity-50">
                  {saving ? 'Saving...' : modal === 'create' ? 'Add' : 'Update'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
