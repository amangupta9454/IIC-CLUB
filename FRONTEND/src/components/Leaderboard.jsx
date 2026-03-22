import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import api from '../utils/api.js';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/leaderboard').then(({ data }) => setLeaderboard(data)).catch(() => setLeaderboard([])).finally(() => setLoading(false));
  }, []);

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-amber-400" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-slate-400" />;
    if (rank === 3) return <Award className="w-8 h-8 text-amber-700" />;
    return <span className="w-8 h-8 flex items-center justify-center font-bold text-slate-500">{rank}</span>;
  };

  if (loading) return <div className="text-slate-400">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
        Leaderboard
      </h1>
      <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] overflow-hidden">
        {leaderboard.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No rankings yet</div>
        ) : (
          <div className="divide-y divide-white/10">
            {leaderboard.map((entry, i) => (
              <motion.div
                key={entry.user?.id ? String(entry.user.id) : `rank-${entry.rank}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-6 p-4 ${entry.rank <= 3 ? 'bg-[#7c3aed]/5' : ''}`}
              >
                <div className="w-12 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="w-12 h-12 rounded-full bg-[#0f172a] overflow-hidden shrink-0">
                  {entry.user?.profileImage ? (
                    <img src={entry.user.profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                      {entry.user?.name?.[0] || '?'}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{entry.user?.name || 'Unknown'}</p>
                  <p className="text-slate-400 text-sm truncate">{entry.user?.email}</p>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-slate-400">Ideas: <span className="text-white">{entry.ideas}</span></span>
                  <span className="text-slate-400">Projects: <span className="text-white">{entry.projects}</span></span>
                  <span className="text-slate-400">Events: <span className="text-white">{entry.events}</span></span>
                  <span className="font-bold text-[#7c3aed]">Score: {entry.total}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
