import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Github, ExternalLink } from 'lucide-react';
import api from '../utils/api.js';

export default function ProjectSubmission() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    demoLink: '',
  });
  const [images, setImages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('submit');

  useEffect(() => {
    if (tab === 'my') {
      api.get('/api/projects/my').then(({ data }) => setProjects(data)).catch(() => setProjects([]));
    }
  }, [tab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files.slice(0, 5));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('techStack', form.techStack);
      fd.append('githubLink', form.githubLink);
      fd.append('demoLink', form.demoLink);
      images.forEach((img) => fd.append('images', img));
      await api.post('/api/projects', fd);
      setForm({ title: '', description: '', techStack: '', githubLink: '', demoLink: '' });
      setImages([]);
      setTab('my');
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
        My Projects
      </h1>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('submit')}
          className={`px-4 py-2 rounded-lg font-medium ${tab === 'submit' ? 'bg-[#7c3aed]/20 text-[#7c3aed]' : 'text-slate-400 hover:text-white'}`}
        >
          Submit New
        </button>
        <button
          onClick={() => setTab('my')}
          className={`px-4 py-2 rounded-lg font-medium ${tab === 'my' ? 'bg-[#7c3aed]/20 text-[#7c3aed]' : 'text-slate-400 hover:text-white'}`}
        >
          My Projects
        </button>
      </div>
      {tab === 'submit' ? (
        <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Project Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Tech Stack (comma separated)</label>
              <input
                name="techStack"
                value={form.techStack}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">GitHub Link</label>
                <input
                  name="githubLink"
                  value={form.githubLink}
                  onChange={handleChange}
                  type="url"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Demo Link</label>
                <input
                  name="demoLink"
                  value={form.demoLink}
                  onChange={handleChange}
                  type="url"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Project Images (max 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#7c3aed]/20 file:text-[#7c3aed]"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] font-semibold disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Project'}
            </motion.button>
          </form>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.length === 0 ? (
            <div className="col-span-2 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-12 text-center text-slate-400">
              No projects yet
            </div>
          ) : (
            projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-6 hover:border-[#7c3aed]/30"
              >
                {project.images?.[0] && (
                  <img
                    src={project.images[0]}
                    alt=""
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.techStack?.map((t, j) => (
                    <span key={j} className="px-2 py-0.5 rounded bg-[#7c3aed]/20 text-xs text-[#7c3aed]">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-[#22d3ee] hover:underline"
                    >
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  )}
                  {project.demoLink && (
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-[#22d3ee] hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" /> Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
}
