import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, UserPlus, Calendar, Check, X } from 'lucide-react';
import api from '../utils/api.js';

const statusColors = { pending: 'bg-amber-500/20 text-amber-400', accepted: 'bg-green-500/20 text-green-400', completed: 'bg-cyan-500/20 text-cyan-400' };

export default function MentorshipManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [modal, setModal] = useState(null); // 'mentor' or 'schedule'
  
  // Mentor form state
  const [mentorForm, setMentorForm] = useState({
     mentorName: '',
     mentorDepartment: '',
     mentorSpecialization: '',
     mentorMobile: '',
     mentorEmail: ''
  });

  const [scheduledAt, setScheduledAt] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  async function fetchRequests() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/mentorship', { params: filter ? { status: filter } : {} });
      setRequests(data);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  async function assignMentor(e) {
    if(e) e.preventDefault();
    if(!modal || !modal.req) return;
    
    setSaving(true);
    try {
      await api.put(`/api/admin/mentorship/${modal.req._id}/mentor`, mentorForm);
      fetchRequests();
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id, status) {
    setSaving(true);
    try {
      await api.put(`/api/admin/mentorship/${id}/status`, { status });
      fetchRequests();
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  }

  async function schedule(id) {
    setSaving(true);
    try {
      await api.put(`/api/admin/mentorship/${id}/schedule`, { scheduledAt: scheduledAt || undefined });
      fetchRequests();
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent"
      >
        Mentorship Requests
      </motion.h1>
      <div className="mb-6 flex gap-2 flex-wrap">
        {['', 'pending', 'accepted', 'completed'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${!filter && !s ? 'bg-[#7c3aed]/30 text-[#7c3aed]' : filter === s ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Requests'}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-slate-400 py-8 text-center flex justify-center items-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-5 hover:border-[#7c3aed]/30 transition shadow-lg"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-6 h-6 text-[#22d3ee] shrink-0" />
                    <h3 className="font-semibold text-lg text-white">Mentorship Request</h3>
                    <span className={`px-2 py-0.5 rounded text-xs tracking-wider uppercase font-bold border ${statusColors[r.status]?.replace('text-', 'border-').replace('/20', '/30') || 'bg-slate-500/20'} ${statusColors[r.status] || ''}`}>
                       {r.status}
                    </span>
                  </div>
                  <div className="pl-9 space-y-1">
                      <p className="text-slate-400 text-sm">Requested By: <span className="text-slate-200">{r.studentId?.name || 'Unknown'}</span> ({r.studentId?.email || '—'})</p>
                      
                      {r.mentorName && (
                         <div className="mt-2 text-sm text-[#7c3aed] bg-[#7c3aed]/10 px-3 py-2 rounded-lg border border-[#7c3aed]/20 inline-block">
                             <p className="font-semibold">Assigned Mentor: {r.mentorName}</p>
                             {(r.mentorDepartment || r.mentorEmail) && (
                                <p className="text-slate-400 text-xs mt-1">
                                   {r.mentorDepartment} {r.mentorDepartment && r.mentorEmail && '•'} {r.mentorEmail}
                                </p>
                             )}
                         </div>
                      )}

                      {r.scheduledAt && (
                        <p className="text-[#22d3ee] text-sm mt-2 flex items-center gap-1.5 bg-[#22d3ee]/10 px-3 py-2 rounded-lg border border-[#22d3ee]/20 inline-flex">
                          <Calendar className="w-4 h-4" /> 
                          <strong className="font-semibold">Scheduled:</strong> {new Date(r.scheduledAt).toLocaleString()}
                        </p>
                      )}
                      
                      <div className="mt-3 p-4 bg-white/5 border border-white/5 rounded-lg text-slate-300 relative">
                         <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Student's Concern</p>
                         <p>"{r.question}"</p>
                      </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0 md:pl-6 md:border-l border-white/10 items-center justify-center">
                  <button
                    onClick={() => { 
                       setModal({ type: 'mentor', req: r }); 
                       setMentorForm({
                           mentorName: r.mentorName || '',
                           mentorDepartment: r.mentorDepartment || '',
                           mentorSpecialization: r.mentorSpecialization || '',
                           mentorMobile: r.mentorMobile || '',
                           mentorEmail: r.mentorEmail || ''
                       });
                    }}
                    className="p-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition"
                    title="Assign or Edit Mentor"
                  >
                    <UserPlus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => { setModal({ type: 'schedule', req: r }); setScheduledAt(r.scheduledAt ? new Date(r.scheduledAt).toISOString().slice(0, 16) : ''); }}
                    className="p-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition"
                    title="Schedule Meeting"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                  {r.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(r._id, 'accepted')}
                      disabled={saving}
                      className="p-2.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition disabled:opacity-50"
                      title="Accept Request"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                  {r.status === 'accepted' && (
                    <button
                      onClick={() => updateStatus(r._id, 'completed')}
                      disabled={saving}
                      className="p-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition disabled:opacity-50"
                      title="Mark Completed"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {requests.length === 0 && (
            <div className="p-8 text-center text-slate-500 rounded-xl border border-white/10">No mentorship requests found.</div>
          )}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl flex flex-col max-h-[90vh]"
            >
               <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                 <h2 className="text-xl font-bold">{modal.type === 'mentor' ? 'Assign Mentor Details' : 'Schedule Session'}</h2>
                 <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
               </div>

               <div className="p-6 overflow-y-auto custom-scrollbar">
                  {modal.type === 'mentor' && (
                    <form onSubmit={assignMentor} id="mentorForm" className="space-y-4">
                      <div>
                         <label className="block text-sm text-slate-400 mb-1">Mentor Full Name <span className="text-red-400">*</span></label>
                         <input
                           value={mentorForm.mentorName}
                           onChange={(e) => setMentorForm(f => ({ ...f, mentorName: e.target.value }))}
                           placeholder="Dr. Jane Doe"
                           className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition"
                           required
                         />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm text-slate-400 mb-1">Department</label>
                            <input
                              value={mentorForm.mentorDepartment}
                              onChange={(e) => setMentorForm(f => ({ ...f, mentorDepartment: e.target.value }))}
                              placeholder="e.g. Computer Science"
                              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition"
                            />
                         </div>
                         <div>
                            <label className="block text-sm text-slate-400 mb-1">Specialization</label>
                            <input
                              value={mentorForm.mentorSpecialization}
                              onChange={(e) => setMentorForm(f => ({ ...f, mentorSpecialization: e.target.value }))}
                              placeholder="e.g. AI / Machine Learning"
                              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition"
                            />
                         </div>
                         <div>
                            <label className="block text-sm text-slate-400 mb-1">Email Address</label>
                            <input
                              type="email"
                              value={mentorForm.mentorEmail}
                              onChange={(e) => setMentorForm(f => ({ ...f, mentorEmail: e.target.value }))}
                              placeholder="mentor@university.edu"
                              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition"
                            />
                         </div>
                         <div>
                            <label className="block text-sm text-slate-400 mb-1">Mobile Number</label>
                            <input
                              type="tel"
                              value={mentorForm.mentorMobile}
                              onChange={(e) => setMentorForm(f => ({ ...f, mentorMobile: e.target.value }))}
                              placeholder="+1 234 567 8900"
                              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition"
                            />
                         </div>
                      </div>
                    </form>
                  )}
                  {modal.type === 'schedule' && (
                    <div className="space-y-4">
                      <p className="text-slate-400 text-sm">Select a date and time to meet with the mentor.</p>
                      <div>
                         <label className="block text-sm text-slate-400 mb-1">Date & Time</label>
                         <input
                           type="datetime-local"
                           value={scheduledAt}
                           onChange={(e) => setScheduledAt(e.target.value)}
                           className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition [color-scheme:dark]"
                         />
                      </div>
                    </div>
                  )}
               </div>

               <div className="p-6 border-t border-white/10 bg-white/5 shrink-0 flex justify-end gap-3">
                  <button onClick={() => setModal(null)} className="px-5 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition">Cancel</button>
                  {modal.type === 'mentor' ? (
                     <button type="submit" form="mentorForm" disabled={saving || !mentorForm.mentorName} className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 transition">
                       {saving ? 'Assigning...' : 'Assign Mentor'}
                     </button>
                  ) : (
                     <button onClick={() => schedule(modal.req._id)} disabled={saving} className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 transition">
                       {saving ? 'Scheduling...' : 'Save Schedule'}
                     </button>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
