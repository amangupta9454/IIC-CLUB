import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Mail, Trash2, UserX, UserCheck, Eye, X, BookOpen, MapPin, Phone } from 'lucide-react';
import api from '../utils/api.js';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  
  // Modal state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [search]);

  async function fetchStudents() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/students', { params: { search: search || undefined } });
      setStudents(data);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  async function viewDetails(id) {
    setDetailsLoading(true);
    try {
      const { data } = await api.get(`/api/admin/students/${id}`);
      setSelectedStudent(data);
    } catch (err) {
      alert('Failed to fetch details');
    } finally {
      setDetailsLoading(false);
    }
  }

  async function suspend(id) {
    setActionLoading(id);
    try {
      await api.put(`/api/admin/students/${id}/suspend`);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setActionLoading(null);
    }
  }

  async function activate(id) {
    setActionLoading(id);
    try {
      await api.put(`/api/admin/students/${id}/activate`);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteStudent(id) {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    setActionLoading(id);
    try {
      await api.delete(`/api/admin/students/${id}`);
      fetchStudents();
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
        Manage Students
      </motion.h1>
      <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] backdrop-blur p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition"
          />
        </div>
      </div>
      {loading ? (
        <div className="text-slate-400 py-8">Loading...</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-slate-400 text-sm">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Course / Branch</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s._id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" />
                        {s.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-500" />
                        {s.email}
                      </div>
                    </td>
                    <td className="p-4">{s.course || '—'} / {s.branch || '—'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${s.isSuspended ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {s.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewDetails(s._id)}
                          className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {s.isSuspended ? (
                          <button
                            onClick={() => activate(s._id)}
                            disabled={actionLoading === s._id}
                            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                            title="Activate"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => suspend(s._id)}
                            disabled={actionLoading === s._id}
                            className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 disabled:opacity-50"
                            title="Suspend"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteStudent(s._id)}
                          disabled={actionLoading === s._id}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {students.length === 0 && (
            <div className="p-8 text-center text-slate-500">No students found.</div>
          )}
        </motion.div>
      )}

      {/* Modal Overlay */}
      <AnimatePresence>
        {(detailsLoading || selectedStudent) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-xl font-bold">Student Profile</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                {detailsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full" />
                  </div>
                ) : (
                  selectedStudent && (
                    <div className="space-y-8">
                      {/* Top Info */}
                      <div className="flex items-start gap-6">
                        {selectedStudent.profileImage ? (
                          <img
                            src={selectedStudent.profileImage}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-2 border-[#7c3aed] object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full border-2 border-[#7c3aed] bg-white/5 flex items-center justify-center text-3xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
                            {selectedStudent.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{selectedStudent.name}</h3>
                          <div className="space-y-2 text-slate-300">
                            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /> {selectedStudent.email}</p>
                            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" /> {selectedStudent.mobile || '—'}</p>
                            <p className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-slate-500" /> {selectedStudent.course || '—'} / {selectedStudent.branch || '—'} / {selectedStudent.year ? `Year ${selectedStudent.year}` : '—'}</p>
                            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500" /> Section {selectedStudent.section || '—'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="h-px w-full bg-white/10 my-4" />

                      {/* Certificates */}
                      <div>
                        <h4 className="text-lg font-bold text-white mb-4">Uploaded Certificates</h4>
                        {selectedStudent.certificates && selectedStudent.certificates.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedStudent.certificates.map(cert => (
                              <div key={cert._id} className="p-4 border border-white/10 rounded-xl bg-white/5 flex gap-4">
                                {cert.imageUrl ? (
                                  <a href={cert.imageUrl} target="_blank" rel="noreferrer" className="block w-20 h-20 shrink-0 rounded overflow-hidden">
                                     <img src={cert.imageUrl} className="w-full h-full object-cover hover:scale-110 transition cursor-pointer" alt="Certificate" />
                                  </a>
                                ) : (
                                  <div className="w-20 h-20 shrink-0 bg-white/10 rounded flex items-center justify-center text-xs text-slate-500">No Image</div>
                                )}
                                <div>
                                  <p className="font-semibold text-white truncate">{cert.title || cert.certificateTitle || 'Certificate'}</p>
                                  <p className="text-sm text-slate-400 truncate">{cert.eventName || 'External event'}</p>
                                  <span className="inline-block px-2 py-0.5 mt-2 text-[10px] rounded bg-[#7c3aed]/20 text-[#22d3ee] border border-[#7c3aed]/30 uppercase tracking-wider font-semibold">
                                    {new Date(cert.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">No certificates uploaded.</p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
