
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { COLORS, SHOP_ITEMS, MOCK_USER } from '../constants';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-700 shadow-2xl flex flex-col"
            style={{ backgroundColor: COLORS.bgCard }}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/20 rounded-xl text-cyan-400">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Points Shop</h2>
                  <p className="text-xs text-slate-400">Redeem points for exclusive perks</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="px-4 py-2 bg-slate-950 rounded-lg border border-slate-800 text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Balance</span>
                    <span className="text-lg font-black text-cyan-400">{MOCK_USER.points} PTS</span>
                 </div>
                 <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Grid Content */}
            <div className="p-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SHOP_ITEMS.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col"
                  >
                    <div className="h-40 w-full overflow-hidden relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase text-white tracking-wider">
                           {item.rarity}
                        </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                         <span className="text-lg font-bold text-cyan-400">{item.cost} PTS</span>
                         <button className="px-4 py-2 bg-slate-800 hover:bg-cyan-500 hover:text-slate-900 text-cyan-400 text-xs font-bold rounded-lg transition-colors border border-slate-700 hover:border-cyan-400">
                            Redeem
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
