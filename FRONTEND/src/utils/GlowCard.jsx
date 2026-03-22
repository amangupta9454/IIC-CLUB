import { motion } from 'framer-motion';

export default function GlowCard({ children, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] backdrop-blur p-6 hover:border-[#7c3aed]/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
}
