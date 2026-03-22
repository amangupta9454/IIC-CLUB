import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Check, X, Download } from 'lucide-react';
import api from '../utils/api.js';

const statusColors = { pending: 'bg-amber-500/20 text-amber-400', approved: 'bg-green-500/20 text-green-400', rejected: 'bg-red-500/20 text-red-400' };

export default function CertificateManagement() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, [filter]);

  async function fetchCertificates() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/certificates', { params: filter ? { status: filter } : {} });
      setCertificates(data);
    } catch {
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }

  async function approve(id) {
    setActionLoading(id);
    try {
      await api.put(`/api/admin/certificates/${id}/approve`);
      fetchCertificates();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setActionLoading(null);
    }
  }

  async function reject(id) {
    setActionLoading(id);
    try {
      await api.put(`/api/admin/certificates/${id}/reject`);
      fetchCertificates();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setActionLoading(null);
    }
  }

  function downloadUrl(url) {
    if (url) window.open(url, '_blank');
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent"
      >
        Certificates Management
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
          {certificates.map((c) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-4 hover:border-[#7c3aed]/30 transition"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-[#10b981]" />
                    <h3 className="font-semibold">{c.certificateTitle || c.title || 'Certificate'}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${statusColors[c.status] || ''}`}>{c.status}</span>
                  </div>
                  <p className="text-slate-400 text-sm">Event: {c.eventName || '—'}</p>
                  <p className="text-slate-500 text-sm">By: {c.studentId?.name || c.studentId?.email || '—'}</p>
                </div>
                <div className="flex gap-2">
                  {(c.certificateFile || c.imageUrl) && (
                    <button
                      onClick={() => downloadUrl(c.certificateFile || c.imageUrl)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-[#22d3ee]/20 text-[#22d3ee]"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {c.status === 'pending' && (
                    <>
                      <button
                        onClick={() => approve(c._id)}
                        disabled={actionLoading === c._id}
                        className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => reject(c._id)}
                        disabled={actionLoading === c._id}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {certificates.length === 0 && (
            <div className="p-8 text-center text-slate-500 rounded-xl border border-white/10">No certificates found.</div>
          )}
        </div>
      )}
    </div>
  );
}
