
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Navigation, MapPin, MessageSquare, Send, User } from 'lucide-react';
import { Cafe, AmenityKey, Review } from '../types';
import { COLORS, AMENITY_CONFIG, getScoreColor } from '../constants';

interface SidebarProps {
  cafe: Cafe | null;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ cafe, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");

  useEffect(() => {
    if (cafe) {
      setReviews(cafe.reviews || []);
      setIsWriting(false);
      setNewReviewText("");
    }
  }, [cafe]);

  const handlePostReview = () => {
    if (!newReviewText.trim()) return;

    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userName: "You",
      rating: 5,
      text: newReviewText,
      date: "Just now"
    };

    setReviews([newReview, ...reviews]);
    setNewReviewText("");
    setIsWriting(false);
  };

  return (
    <AnimatePresence>
      {cafe && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full sm:w-[400px] z-[2000] shadow-2xl overflow-y-auto border-l border-slate-800"
          style={{ backgroundColor: COLORS.bgCard }}
        >
          {/* Header Image */}
          <div className="relative h-56 w-full">
            <img 
              src={cafe.imageUrl} 
              alt={cafe.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/50 hover:bg-slate-950/70 text-white backdrop-blur-sm transition-colors border border-white/5"
            >
              <X size={20} />
            </button>

            <div className="absolute bottom-4 left-6">
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-amber-500 text-slate-900 text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Star size={10} fill="#0f172a" stroke="none" /> {cafe.rating}
                    </span>
                    {cafe.isOpen ? (
                        <span className="text-emerald-400 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                            Open Now
                        </span>
                    ) : (
                         <span className="text-rose-400 text-xs font-medium px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/30">
                            Closed
                        </span>
                    )}
                </div>
                <h2 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
                    {cafe.name}
                </h2>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Address & Actions */}
            <div className="flex justify-between items-start">
                <p className="text-sm leading-relaxed max-w-[70%]" style={{ color: COLORS.textSecondary }}>
                    {cafe.address}
                </p>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-medium text-white border border-slate-700">
                    <Navigation size={14} />
                    Directions
                </button>
            </div>

            <p className="text-sm leading-relaxed border-l-2 border-slate-700 pl-4 italic" style={{ color: COLORS.textSecondary }}>
                "{cafe.description}"
            </p>
            
            {/* Work Vibe Highlights (New UX Improvement) */}
            <div>
                 <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-500">
                    Work Vibe
                </h3>
                <div className="flex flex-wrap gap-2">
                    {cafe.amenities.wifi >= 8 && (
                         <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            🚀 Fast Wifi
                         </span>
                    )}
                     {cafe.amenities.noise >= 8 && (
                         <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center gap-1">
                            🤫 Quiet Zone
                         </span>
                    )}
                     {cafe.amenities.outlet >= 8 && (
                         <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            ⚡ Many Plugs
                         </span>
                    )}
                     {cafe.amenities.comfort >= 8 && (
                         <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                            🛋️ Comfy Seats
                         </span>
                    )}
                    {cafe.amenities.quality >= 8 && (
                         <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                            ☕ Top Tier Coffee
                         </span>
                    )}
                </div>
            </div>

            {/* Score Cards (The "Traffic Light" System) */}
            <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-500">
                    Detailed Scores
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    {(Object.keys(AMENITY_CONFIG) as AmenityKey[]).map((key) => {
                        const config = AMENITY_CONFIG[key];
                        const score = cafe.amenities[key];
                        const styles = getScoreColor(score);
                        const Icon = config.icon;

                        return (
                            <div 
                                key={key} 
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${styles.bg} ${styles.text}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                                            {config.label}
                                        </span>
                                        <span className="text-[10px]" style={{ color: COLORS.textSecondary }}>
                                            {config.description}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Score Indicator */}
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${styles.bg} ${styles.border}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></div>
                                    <span className={`text-sm font-bold ${styles.text}`}>
                                        {score}/10
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

             {/* Footer Actions / Reviews */}
             <div className="pt-4 border-t border-slate-800">
                
                {/* Rate & Earn Points Button (Replaces Write Review) */}
                {!isWriting ? (
                   <button 
                     onClick={() => setIsWriting(true)}
                     className="w-full py-4 rounded-xl font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(34,211,238,0.4)] mb-6 flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                   >
                       <Star size={18} className="fill-slate-950 stroke-slate-950" /> Rate & Earn Points
                   </button>
                ) : (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     className="mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-700"
                   >
                      <h4 className="text-sm font-bold text-white mb-2">Your Review</h4>
                      <textarea
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="Share your experience..."
                        className="w-full bg-slate-800 text-slate-200 text-sm p-3 rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none min-h-[80px] mb-3"
                      />
                      <div className="flex gap-2 justify-end">
                         <button 
                           onClick={() => setIsWriting(false)}
                           className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                         >
                           Cancel
                         </button>
                         <button 
                           onClick={handlePostReview}
                           className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs font-bold rounded-lg flex items-center gap-2"
                         >
                           <Send size={12} /> Post
                         </button>
                      </div>
                   </motion.div>
                )}

                {/* Recent Reviews List */}
                <div>
                   <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-500 flex items-center justify-between">
                       Recent Reviews <span className="text-slate-600 font-mono text-[10px]">{reviews.length}</span>
                   </h3>
                   <div className="space-y-4">
                      {reviews.length > 0 ? reviews.map((review) => (
                        <div key={review.id} className="flex gap-3 pb-4 border-b border-slate-800/50 last:border-0">
                           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400">
                              {review.userAvatar ? (
                                <img src={review.userAvatar} alt="user" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <User size={14} />
                              )}
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="text-sm font-bold text-slate-200">{review.userName}</span>
                                 <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                       <Star 
                                         key={i} 
                                         size={10} 
                                         className={i < review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-700 text-slate-700"} 
                                       />
                                    ))}
                                 </div>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed">{review.text}</p>
                              <span className="text-[10px] text-slate-600 mt-1 block">{review.date}</span>
                           </div>
                        </div>
                      )) : (
                        <div className="text-center py-4 text-slate-600 text-xs italic">
                           No reviews yet. Be the first!
                        </div>
                      )}
                   </div>
                </div>

             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
