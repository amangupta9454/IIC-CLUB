import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Check, X, Loader, MessageSquare, Eye } from 'lucide-react';
import api from '../utils/api.js';

const statusColors = { pending: 'bg-amber-500/20 text-amber-400', approved: 'bg-green-500/20 text-green-400', rejected: 'bg-red-500/20 text-red-400', incubated: 'bg-cyan-500/20 text-cyan-400' };

export default function IdeaModeration() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  // Modals state
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [viewModal, setViewModal] = useState(null);
  
  const [feedbackText, setFeedbackText] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchIdeas();
  }, [filter]);

  async function fetchIdeas() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/ideas', { params: filter ? { status: filter } : {} });
      setIdeas(data);
    } catch {
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status, adminFeedback) {
    setActionLoading(id);
    try {
      await api.put(`/api/admin/ideas/${id}/status`, { status, adminFeedback });
      fetchIdeas();
      setFeedbackModal(null);
      if (viewModal && viewModal._id === id) {
          setViewModal(prev => ({ ...prev, status, adminFeedback }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setActionLoading(null);
    }
  }

  function openActionHandler(idea, status) {
     setFeedbackModal({ id: idea._id, status, currentFeedback: idea.adminFeedback || '' });
     setFeedbackText(idea.adminFeedback || '');
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent"
      >
        Innovation Ideas Moderation
      </motion.h1>
      <div className="mb-6 flex gap-2 flex-wrap">
        {['', 'pending', 'approved', 'rejected', 'incubated'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${!filter && !s ? 'bg-[#7c3aed]/30 text-[#7c3aed]' : filter === s ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Ideas'}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-slate-400 py-8 text-center flex justify-center items-center">
           <div className="animate-spin w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid gap-4">
          {ideas.map((idea) => (
             <motion.div
               key={idea._id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-4 hover:border-[#7c3aed]/30 transition"
             >
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-[#22d3ee] shrink-0" />
                        <h3 className="font-semibold text-lg truncate">{idea.ideaTitle}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs shrink-0 tracking-wide uppercase font-semibold border ${statusColors[idea.status]?.replace('text-', 'border-').replace('/20', '/30') || 'bg-slate-500/20'} ${statusColors[idea.status] || ''}`}>
                            {idea.status}
                        </span>
                     </div>
                     <p className="text-slate-400 text-sm mb-1">{idea.studentId?.name || 'Unknown Student'} <span className="text-slate-500">({idea.studentId?.email || '—'})</span></p>
                     <p className="text-slate-500 text-sm line-clamp-1 italic">"{idea.problemStatement}"</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 shrink-0">
                     {/* View Idea Details Button */}
                     <button
                        onClick={() => setViewModal(idea)}
                        className="px-3 py-1.5 flex items-center gap-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition shadow border border-indigo-500/20"
                        title="View Full Idea"
                     >
                        <Eye className="w-4 h-4" /> View Idea
                     </button>
                     
                     {/* Action Buttons */}
                     {idea.status === 'pending' && (
                        <>
                           <button onClick={() => openActionHandler(idea, 'approved')} className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition" title="Approve">
                              <Check className="w-4 h-4" />
                           </button>
                           <button onClick={() => openActionHandler(idea, 'rejected')} className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition" title="Reject">
                              <X className="w-4 h-4" />
                           </button>
                           <button onClick={() => openActionHandler(idea, 'incubated')} className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition" title="Incubate">
                              <Loader className="w-4 h-4" />
                           </button>
                        </>
                     )}
                     {(idea.status !== 'pending') && (
                        <button onClick={() => openActionHandler(idea, idea.status)} className="p-1.5 rounded-lg bg-white/10 text-slate-400 hover:text-white transition" title="Update Feedback">
                           <MessageSquare className="w-4 h-4" />
                        </button>
                     )}
                  </div>
               </div>
             </motion.div>
          ))}
          {ideas.length === 0 && (
            <div className="p-8 text-center text-slate-500 rounded-xl border border-white/10">No ideas found.</div>
          )}
        </div>
      )}

      <AnimatePresence>
        {/* Full Details Modal */}
        {viewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewModal(null)}>
             <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl flex flex-col max-h-[90vh]"
             >
                <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/5 shrink-0">
                   <div>
                      <div className="flex items-center gap-3 mb-2">
                         <h2 className="text-xl font-bold text-white">{viewModal.ideaTitle}</h2>
                         <span className={`px-2 py-0.5 rounded text-xs tracking-wide uppercase font-semibold border ${statusColors[viewModal.status]?.replace('text-', 'border-').replace('/20', '/30') || 'bg-slate-500/20'} ${statusColors[viewModal.status] || ''}`}>
                            {viewModal.status}
                         </span>
                      </div>
                      <p className="text-sm text-slate-400">By {viewModal.studentId?.name} ({viewModal.studentId?.email})</p>
                   </div>
                   <button onClick={() => setViewModal(null)} className="text-slate-400 hover:text-white transition p-1"><X className="w-5 h-5"/></button>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                   <div>
                      <h4 className="text-sm font-semibold text-[#22d3ee] mb-2 uppercase tracking-wider">Problem Statement</h4>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-slate-300 whitespace-pre-wrap leading-relaxed">
                         {viewModal.problemStatement}
                      </div>
                   </div>
                   
                   <div>
                      <h4 className="text-sm font-semibold text-[#22d3ee] mb-2 uppercase tracking-wider">Proposed Solution</h4>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-slate-300 whitespace-pre-wrap leading-relaxed">
                         {viewModal.proposedSolution}
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <h4 className="text-sm font-semibold text-[#22d3ee] mb-2 uppercase tracking-wider">Target Audience</h4>
                         <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-slate-300">
                            {viewModal.targetAudience}
                         </div>
                      </div>
                      <div>
                         <h4 className="text-sm font-semibold text-[#22d3ee] mb-2 uppercase tracking-wider">Expected Impact</h4>
                         <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-slate-300">
                            {viewModal.expectedImpact}
                         </div>
                      </div>
                   </div>

                   {viewModal.adminFeedback && (
                      <div>
                         <h4 className="text-sm font-semibold text-[#7c3aed] mb-2 uppercase tracking-wider">Admin Feedback</h4>
                         <div className="p-4 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#c4b5fd] whitespace-pre-wrap">
                            {viewModal.adminFeedback}
                         </div>
                      </div>
                   )}
                </div>
                
                <div className="p-6 border-t border-white/10 bg-white/5 shrink-0 flex justify-end gap-3">
                   {viewModal.status === 'pending' && (
                      <>
                         <button onClick={() => { setViewModal(null); openActionHandler(viewModal, 'rejected'); }} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition">Reject</button>
                         <button onClick={() => { setViewModal(null); openActionHandler(viewModal, 'incubated'); }} className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30 transition">Incubate</button>
                         <button onClick={() => { setViewModal(null); openActionHandler(viewModal, 'approved'); }} className="px-4 py-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition">Approve</button>
                      </>
                   )}
                </div>
             </motion.div>
          </div>
        )}

        {/* Feedback Modal */}
        {feedbackModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setFeedbackModal(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-lg">Confirm Action</h3>
                 <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider ${statusColors[feedbackModal.status]}`}>{feedbackModal.status}</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">You can optionally provide feedback to the student regarding this decision.</p>
              
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 outline-none resize-none mb-6 transition"
                rows={4}
                placeholder="Write your feedback here..."
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setFeedbackModal(null)} className="px-5 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition">Cancel</button>
                <button
                  onClick={() => updateStatus(feedbackModal.id, feedbackModal.status, feedbackText)}
                  disabled={actionLoading === feedbackModal.id}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 transition"
                >
                  {actionLoading === feedbackModal.id ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
