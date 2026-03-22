import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Github } from 'lucide-react';
import api from '../utils/api.js';

export default function InnovationIdea() {
  const [form, setForm] = useState({
    ideaTitle: '',
    problemStatement: '',
    proposedSolution: '',
    technologyUsed: '',
    prototypeLink: '',
    githubLink: '',
  });
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('submit');

  useEffect(() => {
    if (tab === 'my') {
      api.get('/api/ideas/my').then(({ data }) => setIdeas(data)).catch(() => setIdeas([]));
    }
  }, [tab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/ideas', form);
      setForm({
        ideaTitle: '',
        problemStatement: '',
        proposedSolution: '',
        technologyUsed: '',
        prototypeLink: '',
        githubLink: '',
      });
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
        Submit Innovation Idea
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
          My Ideas
        </button>
      </div>
      {tab === 'submit' ? (
        <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Idea Title</label>
              <input
                name="ideaTitle"
                value={form.ideaTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Problem Statement</label>
              <textarea
                name="problemStatement"
                value={form.problemStatement}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Proposed Solution</label>
              <textarea
                name="proposedSolution"
                value={form.proposedSolution}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Technology Used</label>
              <input
                name="technologyUsed"
                value={form.technologyUsed}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Prototype Link</label>
                <input
                  name="prototypeLink"
                  value={form.prototypeLink}
                  onChange={handleChange}
                  type="url"
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
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] font-semibold disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Idea'}
            </motion.button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-12 text-center text-slate-400">
              No ideas submitted yet
            </div>
          ) : (
            ideas.map((idea, i) => (
              <motion.div
                key={idea._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-6"
              >
                <h3 className="font-semibold text-lg mb-2">{idea.ideaTitle}</h3>
                <p className="text-slate-400 text-sm mb-2">{idea.problemStatement}</p>
                <p className="text-slate-300 text-sm mb-3">{idea.proposedSolution}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {idea.technologyUsed && (
                    <span className="px-2 py-1 rounded bg-[#7c3aed]/20 text-[#7c3aed]">
                      {idea.technologyUsed}
                    </span>
                  )}
                  {idea.githubLink && (
                    <a
                      href={idea.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#22d3ee] hover:underline"
                    >
                      <Github className="w-3 h-3" /> GitHub
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
