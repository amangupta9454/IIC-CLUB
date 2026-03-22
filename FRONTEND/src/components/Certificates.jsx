import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Download, UploadCloud, X, Plus } from 'lucide-react';
import api from '../utils/api.js';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Upload modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  function fetchCertificates() {
    setLoading(true);
    api.get('/api/certificates')
       .then(({ data }) => setCertificates(data))
       .catch(() => setCertificates([]))
       .finally(() => setLoading(false));
  }

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN') : '');

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const clearForm = () => {
    setFile(null);
    setPreview(null);
    setForm({ title: '', description: '' });
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const closeAndClear = () => {
    setIsModalOpen(false);
    clearForm();
  };

  const uploadToCloudinary = async (file) => {
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dppztet9u/image/upload';
    const UPLOAD_PRESET = 'iic_assets';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file || !form.title) {
       alert("Please provide a title and select a file.");
       return;
    }
    
    setUploading(true);
    try {
      // 1. Upload file to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      
      if(!imageUrl) throw new Error("Cloudinary upload failed");

      // 2. Submit record to our backend logic
      await api.post('/api/certificates', {
         title: form.title,
         description: form.description,
         imageUrl: imageUrl
      });
      
      closeAndClear();
      fetchCertificates();
    } catch(err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || 'Upload Failed');
    } finally {
      setUploading(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
            My Certificates
          </h1>
          <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition shrink-0 shadow-lg text-sm font-medium"
          >
              <Plus className="w-4 h-4" /> Add Certificate
          </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full mx-auto" />
            <p className="text-slate-400 mt-4 text-sm">Loading certificates...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mb-4">
             <Award className="w-10 h-10 text-[#7c3aed]" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Certificates Yet</h3>
          <p className="text-slate-400 max-w-sm">Upload your achievement certificates, participation proofs, and awards to showcase them on your profile.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] overflow-hidden hover:border-[#7c3aed]/30 hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="aspect-[4/3] bg-[#0f172a] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                {cert.imageUrl ? (
                   <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                ) : (
                   <Award className="w-16 h-16 text-slate-600" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href={cert.imageUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/10 backdrop-blur rounded-lg text-white hover:bg-white/20 transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> View Full
                    </a>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col bg-gradient-to-t from-[#0f172a] to-transparent">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{cert.title}</h3>
                {cert.description && <p className="text-slate-400 text-sm mb-3 line-clamp-2 flex-1">{cert.description}</p>}
                {!cert.description && <div className="flex-1"></div>}
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                   <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{formatDate(cert.issuedAt)}</p>
                   <Award className="w-4 h-4 text-[#22d3ee]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeAndClear}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                 <h2 className="text-xl font-bold flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-[#7c3aed]" /> Upload Certificate
                 </h2>
                 <button onClick={closeAndClear} className="text-slate-400 hover:text-white transition"><X className="w-5 h-5"/></button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="certForm" onSubmit={handleUploadSubmit} className="space-y-5">
                   
                   {/* Drag & Drop Area / File Selected Preview */}
                   <div 
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${preview ? 'border-[#7c3aed] bg-[#7c3aed]/5' : 'border-white/20 bg-white/5 hover:border-[#7c3aed]/50 hover:bg-white/10'}`}
                   >
                     <input 
                        type="file" 
                        accept="image/*,application/pdf"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        required={!file}
                     />
                     
                     {preview ? (
                        <div className="flex flex-col items-center">
                           <div className="w-full max-w-[200px] h-32 rounded-lg bg-black/20 overflow-hidden mb-3 border border-white/10">
                              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                           </div>
                           <p className="text-sm font-medium text-[#22d3ee] truncate max-w-full px-4">{file.name}</p>
                           <p className="text-xs text-slate-500 mt-1">Click to replace</p>
                        </div>
                     ) : (
                        <div className="flex flex-col items-center pointer-events-none">
                           <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                              <UploadCloud className="w-6 h-6 text-slate-400" />
                           </div>
                           <p className="font-semibold mb-1">Click to upload image or PDF</p>
                           <p className="text-sm text-slate-400">PNG, JPG, JPEG up to 5MB</p>
                        </div>
                     )}
                   </div>

                   <div>
                      <label className="block text-sm text-slate-400 mb-1">Certificate Title <span className="text-red-400">*</span></label>
                      <input
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="e.g. Intro to Machine Learning - Coursera"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none transition"
                        required
                      />
                   </div>

                   <div>
                      <label className="block text-sm text-slate-400 mb-1">Description (Optional)</label>
                      <textarea
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Briefly describe what you learned..."
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none resize-none transition"
                      />
                   </div>

                </form>
              </div>

              <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3 shrink-0">
                 <button type="button" onClick={closeAndClear} className="px-5 py-2.5 rounded-lg border border-white/20 hover:bg-white/5 transition font-medium">Cancel</button>
                 <button 
                    type="submit" 
                    form="certForm" 
                    disabled={uploading || !file || !form.title} 
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 transition font-medium min-w-[120px] justify-center"
                 >
                    {uploading ? (
                       <>
                         <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                         Uploading...
                       </>
                    ) : 'Upload'}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
