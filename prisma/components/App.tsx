
import React, { useState, useEffect } from 'react';
import { CafeMap } from './components/CafeMap';
import { Sidebar } from './components/Sidebar';
import { SearchFilter } from './components/SearchFilter';
import { LocationPanel } from './components/LocationPanel';
import { UserProfileModal } from './components/UserProfileModal';
import { ShopModal } from './components/ShopModal';
import { AddLocationModal } from './components/AddLocationModal';
import { INITIAL_CAFES, COLORS } from './constants';
import { Cafe, AmenityKey } from './types';
import { Wallet, User, ShoppingBag, Plus } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function App() {
  const [cafes, setCafes] = useState<Cafe[]>(INITIAL_CAFES);
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<AmenityKey | null>(null);
  const [groundingSources, setGroundingSources] = useState<{title: string, uri: string}[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);

  // Fetch Real Data using Gemini API with Google Maps Tool
  useEffect(() => {
    const fetchCafesFromAI = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemInstruction = `
          You are a cafe discovery engine. 
          Find 8-10 popular cafes, roasteries, or work-friendly coffee spots in Beşiktaş, Istanbul.
          Return a purely JSON object with a key "cafes" containing an array.
          
          For each cafe, you MUST provide:
          - id: generate a unique string id (e.g., "ai-1", "ai-2")
          - name: string
          - address: string
          - coordinates: [latitude, longitude] (Numbers)
          - rating: number (1-5)
          - description: A short, moody, 1-sentence description.
          - isOpen: boolean (assume true for now)
          - imageUrl: Use a placeholder like "https://picsum.photos/seed/{name}/800/600"
          - googleMapsUri: The Google Maps URL if available from the tool.
          - amenities: An object with estimated scores (0-10) for: wifi, outlet, comfort, hygiene, quality, noise, service.
            (Estimate these based on the vibe of the place. Work places have high wifi/outlet/comfort. Quick stops have high service/quality).
        `;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: "Find highly rated coffee shops in Besiktas, Istanbul.",
          config: {
            systemInstruction: systemInstruction,
            tools: [{ googleMaps: {} }],
            // responseMimeType: "application/json" // REMOVED: Unsupported with googleMaps
          }
        });

        if (response.text) {
          // Manually parse JSON from text, handling potential Markdown code blocks
          let jsonStr = response.text.trim();
          const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonStr = jsonMatch[1];
          } else {
             // Fallback cleanup if no json tag
             jsonStr = jsonStr.replace(/^```\w*\s*/, '').replace(/\s*```$/, '');
          }

          try {
            const data = JSON.parse(jsonStr);
            if (data.cafes && Array.isArray(data.cafes)) {
              // Merge new cafes, avoiding duplicates by name if possible, or just append
              setCafes(prev => {
                const newCafes = data.cafes.filter((newC: Cafe) => !prev.some(p => p.name === newC.name));
                return [...prev, ...newCafes];
              });
            }
          } catch (e) {
            console.error("Failed to parse JSON from AI response:", e);
          }
        }

        // Extract Grounding Chunks (Sources)
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          const sources = chunks
            .map((chunk: any) => {
              if (chunk.web?.uri && chunk.web?.title) {
                return { title: chunk.web.title, uri: chunk.web.uri };
              }
              if (chunk.maps?.uri) {
                return { title: chunk.maps.title || 'Google Maps', uri: chunk.maps.uri };
              }
              return null;
            })
            .filter((s: any) => s !== null) as {title: string, uri: string}[];
            
            setGroundingSources(prev => [...prev, ...sources]);
        }

      } catch (error) {
        console.error("Failed to fetch cafes from AI:", error);
      }
    };

    fetchCafesFromAI();
  }, []);

  const handleSelectCafe = (cafe: Cafe) => {
    setSelectedCafeId(cafe.id);
  };

  const handleCloseSidebar = () => {
    setSelectedCafeId(null);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    const lowerQuery = query.toLowerCase();
    
    // Find first cafe that matches name or address
    const match = cafes.find(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.address.toLowerCase().includes(lowerQuery)
    );

    if (match) {
      setSelectedCafeId(match.id);
    } else {
      // Optional: Add a visual feedback/toast here if cafe not found
      console.log("No cafe found matching:", query);
    }
  };

  const selectedCafe = cafes.find(c => c.id === selectedCafeId) || null;

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: COLORS.bgMain }}>
      
      {/* Combined Search & Filter (Top Left) */}
      <SearchFilter 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onSearch={handleSearch}
      />

      {/* Location Context Panel (Left Sidebar Area) */}
      <LocationPanel sources={groundingSources} />

      {/* Center Logo */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none drop-shadow-2xl hidden md:block">
        <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#c084fc', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <path d="M50 5 C25 5 5 25 5 50 C5 80 50 100 50 100 C50 100 95 80 95 50 C95 25 75 5 50 5 Z" fill="url(#logoGrad)" filter="url(#glow)" opacity="0.9"/>
            <circle cx="50" cy="45" r="30" fill="#020617" />
            
            <rect x="35" y="30" width="10" height="35" rx="2" fill="url(#logoGrad)" />
            <rect x="48" y="25" width="10" height="40" rx="2" fill="url(#logoGrad)" />
            <rect x="61" y="35" width="10" height="30" rx="2" fill="url(#logoGrad)" />
            
            <path d="M35 30 L40 25 L45 30 Z" fill="#fff" opacity="0.8"/>
            <circle cx="70" cy="55" r="12" fill="#22d3ee" stroke="#020617" strokeWidth="3"/>
            <circle cx="66" cy="55" r="2" fill="#020617"/>
            <circle cx="70" cy="55" r="2" fill="#020617"/>
            <circle cx="74" cy="55" r="2" fill="#020617"/>
        </svg>
      </div>

      {/* Top Right Action Buttons */}
      <div className="absolute top-6 right-6 sm:right-12 z-[1000] hidden sm:flex items-center gap-3">
        
        {/* Add Location Button */}
        <button
          onClick={() => setIsAddLocationOpen(true)}
          className="p-3 rounded-xl backdrop-blur-md border border-slate-700/50 shadow-[0_0_15px_rgba(2,6,23,0.5)] transition-all hover:bg-slate-800/60 hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] active:scale-95 group"
          style={{ backgroundColor: `${COLORS.bgCard}E6` }}
          title="Add Location"
        >
          <Plus size={18} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
        </button>

        {/* Shop Button */}
        <button
          onClick={() => setIsShopOpen(true)}
          className="p-3 rounded-xl backdrop-blur-md border border-slate-700/50 shadow-[0_0_15px_rgba(2,6,23,0.5)] transition-all hover:bg-slate-800/60 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-95 group"
          style={{ backgroundColor: `${COLORS.bgCard}E6` }}
          title="Points Shop"
        >
          <ShoppingBag size={18} className="text-slate-300 group-hover:text-cyan-400 transition-colors" />
        </button>

        {/* User Profile Button */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="p-3 rounded-xl backdrop-blur-md border border-slate-700/50 shadow-[0_0_15px_rgba(2,6,23,0.5)] transition-all hover:bg-slate-800/60 hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(192,132,252,0.15)] active:scale-95 group"
          style={{ backgroundColor: `${COLORS.bgCard}E6` }}
        >
          <User size={18} className="text-slate-300 group-hover:text-purple-400 transition-colors" />
        </button>

        {/* Connect Wallet Button */}
        <button 
          className="flex items-center gap-2 px-5 py-3 rounded-xl backdrop-blur-md border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all hover:bg-cyan-950/40 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 group"
          style={{ backgroundColor: `${COLORS.bgCard}E6` }}
        >
          <Wallet size={18} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          <span className="text-sm font-bold text-cyan-50 group-hover:text-white tracking-wide">Connect Wallet</span>
        </button>
      </div>

      {/* Main Map Area */}
      <CafeMap 
        cafes={cafes} 
        selectedCafeId={selectedCafeId}
        activeFilter={activeFilter}
        onSelectCafe={handleSelectCafe}
      />

      {/* Details Sidebar (Right Drawer) */}
      <Sidebar 
        cafe={selectedCafe} 
        onClose={handleCloseSidebar} 
      />

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      {/* Shop Modal */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
      />

      {/* Add Location Modal */}
      <AddLocationModal
        isOpen={isAddLocationOpen}
        onClose={() => setIsAddLocationOpen(false)}
      />

      {/* X (Twitter) Logo (Bottom Right) */}
      <a 
        href="https://x.com/fikriytm" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute bottom-6 right-6 z-[1000] p-3 rounded-full bg-[#020617] hover:bg-[#0f172a] transition-all hover:scale-110 shadow-2xl border border-white/10 group"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-slate-400 group-hover:fill-white transition-colors">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

    </div>
  );
}
