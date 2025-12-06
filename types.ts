import React from 'react';

export type AmenityKey = 
  | 'wifi' 
  | 'outlet' 
  | 'comfort' 
  | 'hygiene' 
  | 'quality' 
  | 'noise' 
  | 'service';

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  text: string;
  date: string;
}

export interface Cafe {
  id: string;
  name: string;
  address: string;
  rating: number; // Aggregate 5-star rating
  coordinates: [number, number]; // [lat, lng]
  amenities: Record<AmenityKey, number>; // Score 0-10
  imageUrl: string;
  description: string;
  isOpen: boolean;
  googleMapsUri?: string;
  reviews?: Review[];
}

export interface AmenityConfig {
  label: string;
  icon: React.ElementType;
  description: string;
}