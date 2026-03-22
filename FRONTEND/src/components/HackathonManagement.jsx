import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Check, X, Eye, FileText, Video, Github, Lightbulb } from 'lucide-react';
import api from '../utils/api.js';

const statusColors = { pending: 'bg-amber-500/20 text-amber-400', approved: 'bg-green-500/20 text-green-400', rejected: 'bg-red-500/20 text-red-400' };

export default function HackathonManagement() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [evaluateModal, setEvaluateModal] = useState(null); // stores the hackathon object
  const [remarks, setRemarks] = useState('');
  const [actionStatus, setActionStatus] = useState(''); // 'approved' or 'rejected'
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHackathons();
  }, []);

  async function fetchHackathons() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/hackathons');
      setHackathons(data);
    } catch {
      setHackathons([]);
    } finally {
      setLoading(false);
    }
  }

  function openAction(h, status) {
    setEvaluateModal(h);
    setActionStatus(status);
    setRemarks(h.remarks || '');
  }

  async function submitEvaluate() {
    if (!evaluateModal || !actionStatus) return;
    setSaving(true);
    try {
      await api.put(`/api/admin/hackathons/${evaluateModal._id}`, {
        status: actionStatus,
        remarks: remarks,
      });
      setEvaluateModal(null);
      fetchHackathons();
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
        Hackathon & Project Submissions
      </motion.h1>
      {loading ? (
        <div className="text-slate-400 py-8 text-center flex justify-center items-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-4">
          {hackathons.map((h) => (
            <motion.div
              key={h._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-5 hover:border-[#7c3aed]/30 transition"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                {/* Info block */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-6 h-6 text-[#f59e0b] shrink-0" />
                    <h3 className="font-bold text-lg text-white truncate">{h.hackathonName}</h3>
                    <span className="text-slate-400 font-medium">— {h.projectTitle || 'Untitled'}</span>
                    <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider border ${statusColors[h.status]?.replace('text-', 'border-').replace('/20', '/30') || 'bg-slate-500/20'} ${statusColors[h.status] || ''}`}>
                      {h.status || 'pending'}
                    </span>
                  </div>
                  
                  <div className="pl-9 space-y-1">
                      <p className="text-slate-400 text-sm">Submitted By: <span className="text-slate-200">{h.studentId?.name || 'Unknown'}</span> ({h.studentId?.email || '—'})</p>
                      {h.teamMembers && h.teamMembers.length > 0 && (
                          <p className="text-slate-400 text-sm">Team: <span className="text-slate-300">{h.teamMembers.join(', ')}</span></p>
                      )}
                      
                      {h.remarks && (
                          <div className="mt-3 p-3 bg-white/5 border border-white/5 rounded-lg text-sm text-cyan-400 inline-block">
                              <strong>Remarks:</strong> {h.remarks}
                          </div>
                      )}
                  </div>
                </div>

                {/* File Links Block */}
                <div className="flex gap-2 flex-wrap shrink-0">
                    {h.githubLink && (
                        <a href={h.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition text-sm">
                            <Github className="w-4 h-4" /> Code
                        </a>
                    )}
                    {h.presentationFile && (
                        <a href={h.presentationFile} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 transition text-sm">
                            <FileText className="w-4 h-4" /> Presentation
                        </a>
                    )}
                    {h.demoVideo && (
                        <a href={h.demoVideo} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition text-sm">
                            <Video className="w-4 h-4" /> Video
                        </a>
                    )}
                </div>

                {/* Actions Block */}
                <div className="flex gap-2 shrink-0 border-l border-white/10 pl-6 h-full items-center">
                  {(h.status === 'pending' || !h.status) && (
                      <>
                        <button
                          onClick={() => openAction(h, 'approved')}
                          className="px-4 py-2 flex items-center gap-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition shadow-lg shadow-green-500/10"
                        >
                          <Check className="w-4 h-4" /> Accept
                        </button>
                        <button
                          onClick={() => openAction(h, 'rejected')}
                          className="px-4 py-2 flex items-center gap-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </>
                  )}
                  {h.status !== 'pending' && h.status && (
                      <button
                        onClick={() => openAction(h, h.status)}
                        className="px-4 py-2 rounded-lg bg-white/10 text-slate-300 hover:text-white transition"
                      >
                         Update Remarks
                      </button>
                  )}
                </div>

              </div>
            </motion.div>
          ))}
          {hackathons.length === 0 && (
            <div className="p-8 text-center text-slate-500 rounded-xl border border-white/10">No hackathon submissions yet.</div>
          )}
        </div>
      )}

      {/* Evaluation/Remarks Modal */}
      <AnimatePresence>
          {evaluateModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEvaluateModal(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                      <h3 className="font-bold text-lg">Confirm {actionStatus === 'approved' ? 'Acceptance' : actionStatus === 'rejected' ? 'Rejection' : 'Update'}</h3>
                      <p className="text-slate-400 text-sm">{evaluateModal.projectTitle}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider ${statusColors[actionStatus]}`}>{actionStatus}</span>
                </div>
                
                <p className="text-slate-400 text-sm mb-4">You can optionally provide remarks or feedback to the student team regarding this decision.</p>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 outline-none resize-none mb-6 transition"
                  rows={4}
                  placeholder="Official remarks (optional)..."
                />
                <div className="flex justify-end gap-3">
                  <button onClick={() => setEvaluateModal(null)} className="px-5 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition">Cancel</button>
                  <button
                    onClick={submitEvaluate}
                    disabled={saving}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 transition"
                  >
                    {saving ? 'Processing...' : 'Confirm'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
      </AnimatePresence>
    </div>
  );
}
