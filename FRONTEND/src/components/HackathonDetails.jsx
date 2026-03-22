import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Github, Users, FileText } from 'lucide-react';
import api from '../utils/api.js';

export default function HackathonDetails() {
  const [form, setForm] = useState({
    hackathonName: '',
    projectTitle: '',
    teamMembers: '',
    githubLink: '',
    demoVideo: '',
  });
  const [presentationFile, setPresentationFile] = useState(null);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('submit');

  useEffect(() => {
    if (tab === 'my') {
      api.get('/api/hackathons/my').then(({ data }) => setHackathons(data)).catch(() => setHackathons([]));
    }
  }, [tab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'presentationFile') {
      setPresentationFile(e.target.files[0] || null);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('hackathonName', form.hackathonName);
      fd.append('projectTitle', form.projectTitle);
      fd.append('teamMembers', form.teamMembers);
      fd.append('githubLink', form.githubLink);
      fd.append('demoVideo', form.demoVideo);
      if (presentationFile) fd.append('presentationFile', presentationFile);
      await api.post('/api/hackathons', fd);
      setForm({
        hackathonName: '',
        projectTitle: '',
        teamMembers: '',
        githubLink: '',
        demoVideo: '',
      });
      setPresentationFile(null);
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
        Hackathon Submissions
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
          My Submissions
        </button>
      </div>
      {tab === 'submit' ? (
        <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Hackathon Name</label>
                <input
                  name="hackathonName"
                  value={form.hackathonName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Project Title</label>
                <input
                  name="projectTitle"
                  value={form.projectTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Team Members (comma separated)</label>
              <input
                name="teamMembers"
                value={form.teamMembers}
                onChange={handleChange}
                placeholder="Name1, Name2, Name3"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
              />
            </div>
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
              <label className="block text-sm text-slate-400 mb-2">Presentation Upload</label>
              <input
                type="file"
                name="presentationFile"
                accept=".pdf,.pptx"
                onChange={handleChange}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#7c3aed]/20 file:text-[#7c3aed]"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Demo Video URL</label>
              <input
                name="demoVideo"
                value={form.demoVideo}
                onChange={handleChange}
                type="url"
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] font-semibold disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </motion.button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {hackathons.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-12 text-center text-slate-400">
              No hackathon submissions yet
            </div>
          ) : (
            hackathons.map((h, i) => (
              <motion.div
                key={h._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{h.hackathonName}</h3>
                    <p className="text-[#7c3aed] text-sm mt-1">{h.projectTitle}</p>
                    {h.teamMembers?.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-slate-400 text-sm">
                        <Users className="w-4 h-4" />
                        {h.teamMembers.join(', ')}
                      </div>
                    )}
                    {h.githubLink && (
                      <a
                        href={h.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-[#22d3ee] hover:underline text-sm"
                      >
                        <Github className="w-4 h-4" /> GitHub
                      </a>
                    )}
                  </div>
                  {h.presentationFile && (
                    <a
                      href={h.presentationFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-[#22d3ee]"
                    >
                      <FileText className="w-4 h-4" /> Presentation
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
