
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Target } from 'lucide-react';
import { COLORS, MOCK_USER } from '../constants';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl rounded-2xl border border-slate-700 overflow-hidden shadow-2xl"
            style={{ backgroundColor: COLORS.bgCard }}
          >
            {/* Header / Banner */}
            <div className="relative h-40 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors border border-white/5 z-10"
              >
                <X size={20} />
              </button>
              
              <div className="absolute -bottom-10 left-8 flex items-end gap-5">
                <img 
                  src={MOCK_USER.avatar} 
                  alt={MOCK_USER.name} 
                  className="w-24 h-24 rounded-2xl border-4 border-slate-900 shadow-2xl object-cover bg-slate-800"
                />
                <div className="mb-3">
                  <h2 className="text-2xl font-bold text-white tracking-tight">{MOCK_USER.name}</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-cyan-400 font-medium tracking-wide">{MOCK_USER.handle}</p>
                    <span className="text-slate-600 text-xs">•</span>
                    <div className="flex items-center gap-1 text-amber-400">
                        <Award size={14} />
                        <span className="font-bold text-xs">{MOCK_USER.level}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points Display (Top Right) */}
              <div className="absolute bottom-4 right-8 text-right">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold opacity-80">Available Points</span>
                  <div className="text-3xl font-black text-white tracking-tighter drop-shadow-lg">
                    {MOCK_USER.points.toLocaleString()} <span className="text-sm font-bold text-cyan-400">PTS</span>
                  </div>
              </div>
            </div>

            <div className="pt-16 px-8 pb-8 space-y-8">
              
              {/* Main Dashboard - Full Width (Active Rewards Removed) */}
              <div className="space-y-4">
                  <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-2">
                    <Target size={14} /> Performance Stats
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/50 transition-colors text-center md:text-left">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reviews</span>
                        <span className="text-2xl font-bold text-white">{MOCK_USER.stats.reviews}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/50 transition-colors text-center md:text-left">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Accuracy</span>
                        <span className="text-2xl font-bold text-emerald-400">{MOCK_USER.stats.accuracy}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/50 transition-colors text-center md:text-left">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Venues</span>
                        <span className="text-2xl font-bold text-cyan-400">{MOCK_USER.stats.discovered}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/50 transition-colors text-center md:text-left">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Expertise</span>
                        <span className="text-sm font-bold text-amber-400 truncate block mt-1">{MOCK_USER.stats.expertise}</span>
                    </div>
                  </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
