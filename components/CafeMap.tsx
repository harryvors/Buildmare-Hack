import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { Cafe, AmenityKey } from '../types';
import { COLORS } from '../constants';

interface CafeMapProps {
  cafes: Cafe[];
  selectedCafeId: string | null;
  activeFilter: AmenityKey | null;
  onSelectCafe: (cafe: Cafe) => void;
}

// Component to handle map center updates smoothly
const MapController: React.FC<{ selectedCafe: Cafe | undefined }> = ({ selectedCafe }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedCafe) {
      map.flyTo(selectedCafe.coordinates, 15, { duration: 1.5 });
    }
  }, [selectedCafe, map]);
  return null;
};

// Custom Icon Generator with SVG Pin
const createCustomIcon = (isSelected: boolean, isHighlighted: boolean, isDimmed: boolean, score: number) => {
  // Color Logic
  let fillClass = 'fill-slate-500'; // Default Slate Grey
  let strokeClass = 'stroke-[#020617]'; // Deep Navy Stroke
  let glowClass = '';
  let zIndex = 'z-10';
  
  if (isSelected) {
    fillClass = 'fill-white';
    zIndex = 'z-50';
  } else if (isHighlighted) {
    zIndex = 'z-40';
    if (score >= 8) {
      fillClass = 'fill-cyan-400'; // Cyan/Electric Blue
      glowClass = 'marker-glow-green'; // Uses the Cyan glow CSS
    } else if (score >= 4) {
      fillClass = 'fill-amber-400';
      glowClass = 'marker-glow-yellow';
    } else {
      fillClass = 'fill-rose-400';
      glowClass = 'marker-glow-red';
    }
  }

  const opacity = isDimmed ? 0.3 : 1;
  const size = isSelected ? 48 : (isHighlighted ? 42 : 32); // Icon size

  // SVG Map Pin Path
  const html = `
    <div class="relative flex items-center justify-center w-full h-full transition-all duration-500 ${zIndex}" style="opacity: ${opacity}">
      <svg 
        viewBox="0 0 24 24" 
        class="w-full h-full drop-shadow-lg ${glowClass} transition-all duration-300"
      >
        <path 
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
          class="${fillClass} ${strokeClass}" 
          stroke-width="1.5"
        />
        <circle cx="12" cy="9" r="2.5" class="fill-[#020617]" />
      </svg>
    </div>
  `;

  return L.divIcon({
    className: 'bg-transparent',
    html: html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // Anchor at bottom tip
  });
};

export const CafeMap: React.FC<CafeMapProps> = ({ cafes, selectedCafeId, activeFilter, onSelectCafe }) => {
  const selectedCafe = cafes.find(c => c.id === selectedCafeId);

  return (
    <MapContainer 
      center={[41.0082, 28.9784]} // Istanbul default center
      zoom={13} 
      zoomControl={false}
      style={{ height: '100%', width: '100%', background: COLORS.bgMain }}
    >
      {/* Dark Matter Tiles - CSS filter in index.html tints this blue */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {/* Zoom Control at Top Right */}
      <ZoomControl position="topright" />
      
      <MapController selectedCafe={selectedCafe} />

      {cafes.map((cafe) => {
        const isSelected = selectedCafeId === cafe.id;
        
        // Filter Logic
        let isHighlighted = false;
        let isDimmed = false;
        let score = 0;

        if (activeFilter) {
            score = cafe.amenities[activeFilter];
            if (score >= 8) {
                isHighlighted = true; // High score in this category
            } else {
                isDimmed = true; // Fade out low scores
            }
        }

        return (
          <Marker
            key={cafe.id}
            position={cafe.coordinates}
            icon={createCustomIcon(isSelected, isHighlighted, isDimmed, score)}
            eventHandlers={{
              click: () => onSelectCafe(cafe),
            }}
          />
        );
      })}
    </MapContainer>
  );
};