import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Pencil, Trash2, Users, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api.js';

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'create', 'edit', 'participants'
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    image: '',
    bannerImage: '',
    registrationDeadline: '',
    applyLink: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/events');
      setEvents(data);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setModal('create');
    setForm({
      title: '',
      description: '',
      date: '',
      venue: '',
      image: '',
      bannerImage: '',
      registrationDeadline: '',
      applyLink: '',
    });
  }

  function openEdit(ev) {
    setModal('edit');
    setForm({
      id: ev._id,
      title: ev.title,
      description: ev.description,
      date: ev.date ? new Date(ev.date).toISOString().slice(0, 16) : '',
      venue: ev.venue,
      image: ev.image || '',
      bannerImage: ev.bannerImage || '',
      registrationDeadline: ev.registrationDeadline ? new Date(ev.registrationDeadline).toISOString().slice(0, 16) : '',
      applyLink: ev.applyLink || '',
    });
  }

  function openParticipants(ev) {
    setSelectedEvent(ev);
    setModal('participants');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        date: form.date || undefined,
        registrationDeadline: form.registrationDeadline || undefined,
      };
      if (modal === 'create') {
        await api.post('/api/admin/events', payload);
      } else {
        await api.put(`/api/admin/events/${form.id}`, payload);
      }
      setModal(null);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id) {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/api/admin/events/${id}`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent"
      >
        Manage Events
      </motion.h1>
      <div className="mb-6 flex justify-end">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>
      {loading ? (
        <div className="text-slate-400 py-8 text-center flex justify-center items-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4"
        >
          {events.map((ev) => (
            <div
              key={ev._id}
              className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-4 flex flex-wrap items-center justify-between gap-4 hover:border-[#7c3aed]/30 transition"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                 {ev.image ? (
                   <img src={ev.image} alt={ev.title} className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0" />
                 ) : (
                    <div className="w-16 h-16 rounded-lg bg-[#7c3aed]/20 flex items-center justify-center border border-[#7c3aed]/30 shrink-0">
                      <Calendar className="w-8 h-8 text-[#7c3aed]" />
                    </div>
                 )}
                <div>
                  <h3 className="font-semibold text-lg">{ev.title}</h3>
                  <p className="text-slate-400 text-sm flex gap-2"><span>{new Date(ev.date).toLocaleDateString()}</span><span>·</span><span>{ev.venue}</span></p>
                  <div className="flex gap-4 mt-2">
                      <button onClick={() => openParticipants(ev)} className="text-[#22d3ee] text-xs flex items-center gap-1 hover:underline bg-[#22d3ee]/10 px-2 py-0.5 rounded cursor-pointer transition">
                        <Users className="w-3 h-3" />
                        {ev.registeredUsers?.length || 0} participants
                      </button>
                      {ev.applyLink && (
                         <a href={ev.applyLink} target="_blank" rel="noreferrer" className="text-[#7c3aed] text-xs flex items-center gap-1 hover:underline bg-[#7c3aed]/10 px-2 py-0.5 rounded transition">
                           <LinkIcon className="w-3 h-3" /> External Link
                         </a>
                      )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(ev)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-[#7c3aed]/20 text-[#7c3aed] transition"
                  title="Edit Event"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteEvent(ev._id)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="p-8 text-center text-slate-500 rounded-xl border border-white/10">No events yet.</div>
          )}
        </motion.div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {(modal === 'create' || modal === 'edit') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                 <h2 className="text-xl font-bold">{modal === 'create' ? 'Create Event' : 'Edit Event'}</h2>
                 <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form onSubmit={handleSubmit} id="eventForm" className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none resize-none transition"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Date</label>
                      <input
                        type="datetime-local"
                        value={form.date}
                        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition [color-scheme:dark]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Venue / Location</label>
                      <input
                        value={form.venue}
                        onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1 flex items-center gap-1"><ImageIcon className="w-4 h-4"/> Image URL</label>
                      <input
                        type="url"
                        value={form.image}
                        onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1 flex items-center gap-1"><LinkIcon className="w-4 h-4"/> External Apply Link</label>
                      <input
                        type="url"
                        value={form.applyLink}
                        onChange={(e) => setForm((f) => ({ ...f, applyLink: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition"
                        placeholder="https://docs.google.com/..."
                      />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm text-slate-400 mb-1">Registration Deadline (optional)</label>
                       <input
                         type="datetime-local"
                         value={form.registrationDeadline}
                         onChange={(e) => setForm((f) => ({ ...f, registrationDeadline: e.target.value }))}
                         className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition [color-scheme:dark]"
                       />
                     </div>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-white/10 flex justify-end gap-3 shrink-0 bg-white/5">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="px-6 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="eventForm"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition disabled:opacity-50 min-w-[100px]"
                >
                  {saving ? 'Saving...' : modal === 'create' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Participants Modal */}
        {modal === 'participants' && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
             <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl flex flex-col max-h-[90vh]"
             >
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                 <div>
                    <h2 className="text-xl font-bold">Registered Users</h2>
                    <p className="text-sm text-[#22d3ee] mt-1">{selectedEvent.title}</p>
                 </div>
                 <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                   {selectedEvent.registeredUsers && selectedEvent.registeredUsers.length > 0 ? (
                      <div className="grid gap-3">
                         {selectedEvent.registeredUsers.map(user => (
                            <div key={user._id} className="p-4 rounded-lg border border-white/10 bg-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                               <div>
                                  <p className="font-semibold">{user.name}</p>
                                  <p className="text-sm text-slate-400">{user.email}</p>
                               </div>
                               <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Registered</span>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="text-center py-12 text-slate-500">
                         <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                         <p>No students have registered yet.</p>
                      </div>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
