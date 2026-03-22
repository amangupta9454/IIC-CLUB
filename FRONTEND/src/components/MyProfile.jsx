import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera } from 'lucide-react';
import api from '../utils/api.js';

const courses = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'Other'];
const years = ['1', '2', '3', '4'];
const branches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'Other'];

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    api.get('/api/users/profile').then(({ data }) => {
      setProfile(data);
      setForm({
        name: data.name || '',
        mobile: data.mobile || '',
        course: data.course || '',
        branch: data.branch || '',
        year: data.year || '',
        section: data.section || '',
      });
    }).catch(() => {
      setProfile(null);
      setForm({});
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'profileImage') {
      setImageFile(e.target.files[0]);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      if (imageFile) fd.append('profileImage', imageFile);
      const { data } = await api.patch('/api/users/profile', fd);
      setProfile(data);
      setEdit(false);
      setImageFile(null);
      let user = {};
      try {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'undefined') user = JSON.parse(userStr);
      } catch (e) {}
      localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-400">Loading...</div>;
  if (!profile) return <div className="text-red-400">Failed to load profile. Please try again.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
        My Profile
      </h1>
      <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] backdrop-blur p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#0f172a] border-2 border-[#7c3aed]/30 overflow-hidden">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-slate-500" />
                </div>
              )}
            </div>
            {edit && (
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center cursor-pointer">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  name="profileImage"
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <p className="text-slate-400 text-sm">{profile?.email}</p>
            <p className="font-semibold">{profile?.name}</p>
          </div>
        </div>
        {edit ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Mobile</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Course</label>
                <select
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                >
                  {courses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Branch</label>
                <select
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                >
                  {branches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Year</label>
                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Section</label>
                <input
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] font-semibold"
              >
                {saving ? 'Saving...' : 'Save'}
              </motion.button>
              <button
                type="button"
                onClick={() => setEdit(false)}
                className="px-6 py-2 rounded-lg border border-white/20 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <p><span className="text-slate-400">Mobile:</span> {profile?.mobile}</p>
            <p><span className="text-slate-400">Course:</span> {profile?.course}</p>
            <p><span className="text-slate-400">Branch:</span> {profile?.branch}</p>
            <p><span className="text-slate-400">Year:</span> {profile?.year}</p>
            <p><span className="text-slate-400">Section:</span> {profile?.section}</p>
            <motion.button
              onClick={() => setEdit(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] font-semibold"
            >
              Edit Profile
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
