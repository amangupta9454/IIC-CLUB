import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Link as LinkIcon, FileText, Video, PlayCircle } from 'lucide-react';
import api from '../utils/api.js';

export default function LearningResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/resources');
      setResources(data);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  }

  const getResourceIcon = (type) => {
    switch(type) {
      case 'video': return <PlayCircle className="w-10 h-10 mb-4 text-[#ec4899]" />;
      case 'link': return <LinkIcon className="w-10 h-10 mb-4 text-[#22d3ee]" />;
      case 'document':
      default: return <FileText className="w-10 h-10 mb-4 text-[#3b82f6]" />;
    }
  };

  const getResourceColorClass = (type) => {
    switch(type) {
      case 'video': return 'group-hover:border-[#ec4899]/50 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]';
      case 'link': return 'group-hover:border-[#22d3ee]/50 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]';
      case 'document':
      default: return 'group-hover:border-[#3b82f6]/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-8">
         <div className="p-3 bg-[#7c3aed]/20 rounded-xl">
             <BookOpen className="w-6 h-6 text-[#7c3aed]" />
         </div>
         <h1 className="text-2xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
           Learning Resources
         </h1>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full mx-auto" />
            <p className="text-slate-400 mt-4 text-sm">Loading materials...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center flex flex-col items-center justify-center">
          <BookOpen className="w-12 h-12 text-slate-500 mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2 text-slate-300">No Resources Available</h3>
          <p className="text-slate-500 max-w-sm">No learning materials have been uploaded by the faculty yet. Please check back later.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {resources.map((r, i) => (
            <motion.a
              key={r._id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className={`group rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-6 transition-all block relative overflow-hidden flex flex-col h-full ${getResourceColorClass(r.type)}`}
            >
              {/* Decorative gradient blur in background */}
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/5 blur-2xl rounded-full group-hover:bg-[#7c3aed]/10 transition-colors" />
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                   {getResourceIcon(r.type)}
                   <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 bg-white/5 px-2 py-1 rounded">
                     {r.type}
                   </span>
                </div>
                
                <h3 className="font-bold text-lg mb-2 text-white group-hover:text-[#22d3ee] transition-colors">{r.title}</h3>
                
                <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">
                   {r.description || 'No description provided.'}
                </p>
                
                <div className="inline-flex items-center gap-2 text-[#7c3aed] text-sm font-semibold mt-auto group-hover:translate-x-1 transition-transform">
                  Access Resource <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </motion.div>
  );
}
