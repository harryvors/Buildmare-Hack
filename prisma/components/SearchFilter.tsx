
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { AmenityKey } from '../types';
import { AMENITY_CONFIG, AMENITY_KEYS, COLORS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFilterProps {
  activeFilter: AmenityKey | null;
  onFilterChange: (key: AmenityKey | null) => void;
  onSearch: (query: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ activeFilter, onFilterChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleToggleFilter = () => {
    if (!activeFilter) {
      onFilterChange(AMENITY_KEYS[0]); // Start with first
    } else {
      const currentIndex = AMENITY_KEYS.indexOf(activeFilter);
      if (currentIndex === AMENITY_KEYS.length - 1) {
        onFilterChange(null); // Reset
      } else {
        onFilterChange(AMENITY_KEYS[currentIndex + 1]); // Next
      }
    }
  };

  const handleSearchSubmit = () => {
    onSearch(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const CurrentIcon = activeFilter ? AMENITY_CONFIG[activeFilter].icon : Filter;
  const currentLabel = activeFilter ? AMENITY_CONFIG[activeFilter].label : 'All Locations';

  return (
    <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2 w-full max-w-sm">
      <div 
        className="flex items-center gap-0 rounded-xl shadow-2xl backdrop-blur-md border border-slate-700/50 overflow-hidden"
        style={{ backgroundColor: `${COLORS.bgCard}CC` }}
      >
        {/* Toggle Button */}
        <button 
          onClick={handleToggleFilter}
          className="h-12 w-14 flex items-center justify-center border-r border-slate-700/50 hover:bg-slate-800/50 transition-colors group relative"
          title="Cycle Filters"
        >
          <AnimatePresence mode="wait">
             <motion.div
                key={activeFilter || 'default'}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
             >
               <CurrentIcon 
                size={20} 
                className={activeFilter ? 'text-cyan-400' : 'text-slate-400'} 
               />
             </motion.div>
          </AnimatePresence>
          
          {/* Active Dot */}
          {activeFilter && (
            <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          )}
        </button>

        {/* Search Input */}
        <div className="flex-1 flex items-center px-4 gap-3">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeFilter ? `Filtering by ${currentLabel}...` : "Search cafes..."}
            className="bg-transparent border-none outline-none w-full text-sm placeholder-slate-500 h-12"
            style={{ color: COLORS.textPrimary, caretColor: '#22d3ee' }} 
          />
          <button onClick={handleSearchSubmit} className="hover:text-cyan-400 transition-colors text-slate-500">
             <Search size={18} />
          </button>
        </div>
      </div>
      
      {/* Helper Text */}
      <div className="pl-1 text-[10px] text-slate-500 font-mono tracking-wide uppercase">
        {activeFilter ? (
          <span className="text-cyan-400 flex items-center gap-1 shadow-cyan-500/20">
             ● Filter Active: {currentLabel}
          </span>
        ) : "Click icon to filter amenities"}
      </div>
    </div>
  );
};
