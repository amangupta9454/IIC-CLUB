import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, Send, Calendar, CheckCircle2, User, Building, Mail, Phone } from 'lucide-react';
import api from '../utils/api.js';

export default function Mentorship() {
  const [question, setQuestion] = useState('');
  const [mentorNamePref, setMentorNamePref] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
     setLoading(true);
     try {
        const { data } = await api.get('/api/mentorship/sessions');
        setSessions(data);
     } catch (err) {
        setSessions([]);
     } finally {
        setLoading(false);
     }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question) return;
    
    setSubmitLoading(true);
    try {
      await api.post('/api/mentorship/request', { question, mentorName: mentorNamePref });
      setQuestion('');
      setMentorNamePref('');
      fetchSessions();
    } catch (err) {
      alert(err.response?.data?.message || 'Request failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const configs = {
      pending: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: null },
      accepted: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <CheckCircle2 className="w-3 h-3" /> },
      completed: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <CheckCircle2 className="w-3 h-3" /> }
    };
    
    const conf = configs[status] || configs.pending;
    
    return (
       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${conf.color}`}>
          {conf.icon} {status}
       </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-8">
         <div className="p-3 bg-[#7c3aed]/20 rounded-xl">
             <Users className="w-6 h-6 text-[#7c3aed]" />
         </div>
         <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
              Mentorship Program
            </h1>
            <p className="text-slate-400 text-sm mt-1">Connect with experts, get guidance, and accelerate your growth.</p>
         </div>
      </div>
      
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Request Form Sidebar */}
        <div className="lg:col-span-2">
           <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 md:p-8 sticky top-6 shadow-xl relative overflow-hidden">
             
             {/* Decorative glow */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c3aed]/10 blur-3xl rounded-full" />
             
             <h2 className="font-bold text-xl mb-6 flex items-center gap-2 relative z-10 text-white">
               <Send className="w-5 h-5 text-[#22d3ee]" />
               Request a Session
             </h2>
             
             <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1.5">Preferred Mentor (Optional)</label>
                 <input
                   value={mentorNamePref}
                   onChange={(e) => setMentorNamePref(e.target.value)}
                   placeholder="e.g. Dr. Adam Smith"
                   className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 outline-none transition"
                 />
                 <p className="text-xs text-slate-500 mt-1.5">Leave blank if you want us to match you.</p>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1.5">What do you want to discuss? <span className="text-red-400">*</span></label>
                 <textarea
                   value={question}
                   onChange={(e) => setQuestion(e.target.value)}
                   placeholder="I need help with scaling my startup idea in the education sector..."
                   rows={5}
                   className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 outline-none resize-none transition"
                   required
                 />
               </div>
               
               <motion.button
                 type="submit"
                 disabled={submitLoading || !question.trim()}
                 whileHover={question.trim() ? { scale: 1.02 } : {}}
                 whileTap={question.trim() ? { scale: 0.98 } : {}}
                 className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] font-bold text-white shadow-lg shadow-[#7c3aed]/25 hover:shadow-[#7c3aed]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
               >
                 {submitLoading ? (
                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                 ) : (
                    <>Submit Request <Send className="w-4 h-4" /></>
                 )}
               </motion.button>
             </form>
           </div>
        </div>

        {/* Sessions List */}
        <div className="lg:col-span-3">
          <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
             <MessageCircle className="w-5 h-5 text-[#7c3aed]" />
             My Mentorship Requests
          </h2>
          
          {loading ? (
             <div className="py-12 flex justify-center">
                 <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
             </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center flex flex-col items-center">
               <div className="w-16 h-16 bg-[#7c3aed]/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-slate-500" />
               </div>
               <h3 className="text-lg font-bold text-white mb-2">No Requests Yet</h3>
               <p className="text-slate-400 max-w-sm">You haven't requested any mentorship sessions yet. Use the form to reach out to faculty for guidance.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <AnimatePresence>
                {sessions.map((s, i) => (
                  <motion.div
                    key={s._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-colors overflow-hidden flex flex-col"
                  >
                    {/* Header */}
                    <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
                       <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Request ID: {s._id.slice(-6).toUpperCase()}</span>
                       </div>
                       <StatusBadge status={s.status} />
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 md:p-6 flex-1 flex flex-col gap-6">
                       
                       {/* Problem statement */}
                       <div>
                          <p className="text-sm font-semibold text-[#22d3ee] mb-2 uppercase tracking-wider">Your Question</p>
                          <p className="text-slate-200 text-[15px] leading-relaxed bg-[#22d3ee]/5 border border-[#22d3ee]/10 p-4 rounded-xl">
                             "{s.question}"
                          </p>
                       </div>

                       {/* Assignment Details */}
                       {s.mentorName ? (
                          <div className="bg-[#7c3aed]/5 border border-[#7c3aed]/20 rounded-xl p-5 relative overflow-hidden">
                             <div className="absolute right-0 top-0 w-24 h-24 bg-[#7c3aed]/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2" />
                             
                             <h4 className="text-sm font-semibold text-[#7c3aed] mb-4 uppercase tracking-wider flex items-center gap-2">
                                <User className="w-4 h-4" /> Assigned Mentor Details
                             </h4>
                             
                             <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                                <div className="space-y-3">
                                   <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-full bg-[#7c3aed]/20 flex items-center justify-center shrink-0">
                                         <User className="w-4 h-4 text-[#c4b5fd]" />
                                      </div>
                                      <div>
                                         <p className="text-xs text-slate-400">Name</p>
                                         <p className="font-semibold text-white">{s.mentorName}</p>
                                      </div>
                                   </div>
                                   
                                   {s.mentorDepartment && (
                                     <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                           <Building className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                           <p className="text-xs text-slate-400">Department</p>
                                           <p className="text-sm text-slate-200">{s.mentorDepartment}</p>
                                        </div>
                                     </div>
                                   )}
                                </div>
                                
                                <div className="space-y-3">
                                   {(s.mentorEmail || s.mentorMobile) && (
                                     <div className="space-y-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                        {s.mentorEmail && (
                                          <div className="flex items-center gap-2 text-sm text-slate-300">
                                             <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                             <a href={`mailto:${s.mentorEmail}`} className="hover:text-[#22d3ee] truncate" title={s.mentorEmail}>{s.mentorEmail}</a>
                                          </div>
                                        )}
                                        {s.mentorMobile && (
                                          <div className="flex items-center gap-2 text-sm text-slate-300">
                                             <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                             <a href={`tel:${s.mentorMobile}`} className="hover:text-[#22d3ee]">{s.mentorMobile}</a>
                                          </div>
                                        )}
                                     </div>
                                   )}

                                   {s.mentorSpecialization && (
                                      <div>
                                         <span className="inline-block px-2.5 py-1 bg-[#22d3ee]/10 text-[#22d3ee] rounded-md text-xs font-medium border border-[#22d3ee]/20">
                                           Specialization: {s.mentorSpecialization}
                                         </span>
                                      </div>
                                   )}
                                </div>
                             </div>
                          </div>
                       ) : (
                          <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                             <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                             <p className="text-sm text-amber-400/80">Waiting for faculty admin to review and assign a suitable mentor.</p>
                          </div>
                       )}

                       {/* Schedule & Feedback */}
                       {(s.scheduledAt || s.feedback) && (
                           <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
                              {s.scheduledAt && (
                                <div className="flex-1 flex items-start gap-3 bg-blue-500/5 p-3.5 rounded-xl border border-blue-500/10">
                                  <Calendar className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                  <div>
                                     <p className="text-xs text-blue-400/80 font-semibold uppercase tracking-wider mb-0.5">Scheduled Meeting</p>
                                     <p className="text-sm font-medium text-blue-100">{new Date(s.scheduledAt).toLocaleString()}</p>
                                  </div>
                                </div>
                              )}
                              
                              {s.feedback && (
                                <div className="flex-1 flex items-start gap-3 bg-white/5 p-3.5 rounded-xl">
                                  <MessageCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                  <div>
                                     <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Closing Note / Feedback</p>
                                     <p className="text-sm text-slate-300 italic">"{s.feedback}"</p>
                                  </div>
                                </div>
                              )}
                           </div>
                       )}

                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
