import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Sparkles } from 'lucide-react';
import api from '../utils/api.js';

const courses = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'Other'];
const years = ['1', '2', '3', '4'];
const branches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'Other'];

export default function Signup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    course: '',
    branch: '',
    year: '',
    section: '',
    profileImage: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'profileImage') {
      setForm((f) => ({ ...f, profileImage: e.target.files[0] || null }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => {
        if (form[k] && k !== 'profileImage') fd.append(k, form[k]);
        if (k === 'profileImage' && form.profileImage) fd.append('profileImage', form.profileImage);
      });
      await api.post('/api/auth/register', fd);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/verify-otp', { email: form.email, otp });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center p-4 bg-[#020617] py-12"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.05)] backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(124,58,237,0.15)]"
        >
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-8 h-8 text-[#7c3aed]" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent">
              IIC Innovation Platform
            </h1>
          </div>
          {step === 1 ? (
            <>
              <h2 className="text-xl font-semibold mb-6">Register</h2>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">{error}</div>
              )}
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Mobile</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Course</label>
                  <select
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                    required
                  >
                    <option value="">Select</option>
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
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                    required
                  >
                    <option value="">Select</option>
                    {branches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Year</label>
                    <select
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                      required
                    >
                      <option value="">Select</option>
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
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Profile Image</label>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#7c3aed]/20 file:text-[#7c3aed]"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register'}
                </motion.button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2">Verify Email</h2>
              <p className="text-slate-400 text-sm mb-6">Enter the OTP sent to {form.email}</p>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">{error}</div>
              )}
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.toUpperCase())}
                  placeholder="Enter OTP"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] outline-none text-center text-xl tracking-widest"
                  required
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] font-semibold disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </motion.button>
              </form>
            </>
          )}
          <p className="mt-6 text-center text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-[#7c3aed] hover:underline font-medium">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
