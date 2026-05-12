export interface Tour {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  stops: AudioStop[];
  coverImage: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  language: string;
  category: string;
  featured: boolean;
  downloadable: boolean;
}

export interface AudioStop {
  id: string;
  tourId: string;
  name: string;
  description: string;
  audioUrl: string;
  duration: number; // in seconds
  location: Location;
  images: string[];
  order: number;
  autoPlay: boolean; // GPS-triggered
  radius: number; // meters for GPS trigger
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  floor?: string;
  room?: string;
}

export interface TourProgress {
  tourId: string;
  currentStopId: string;
  completedStops: string[];
  lastPlayed: Date;
  progress: number; // percentage
}
