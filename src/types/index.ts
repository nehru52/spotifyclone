// Audio types
export type AudioVariant = 'quick' | 'deep' | 'kids';

export type AudioLang =
  | 'en'
  | 'it'
  | 'es'
  | 'fr'
  | 'de'
  | 'zh'
  | 'ja'
  | 'pt'
  | 'pl'
  | 'ru'
  | 'ar'
  | 'ko';

export interface AudioTrack {
  url: string; // Remote URL (Cloudflare R2)
  duration: number; // seconds
  size: number; // bytes
}

export type LangAudioFiles = {
  [lang in AudioLang]?: {
    [variant in AudioVariant]?: AudioTrack;
  };
};

// Sight (Audio Stop) type
export interface Sight {
  id: string;
  name: string;
  name_it?: string;
  lat: number;
  lng: number;
  radius: number;
  category: 'ancient' | 'religious' | 'museum' | 'piazza' | 'other';
  has_tips: boolean;
  pack?: 'essential' | 'full';
  thumbnail: string;
  description: string;
  tips?: string[];
  kidsMyth?: string;
  /** Multilingual audio: audioFiles[lang][variant] */
  audioFiles: LangAudioFiles;
  /** Multilingual transcripts: transcripts[lang][variant] */
  transcripts?: {
    [lang in AudioLang]?: {
      [variant in AudioVariant]?: string;
    };
  };
  linkedTour?: {
    slug: string;
    title: string;
    price?: number;
    site?: { domain: string };
  };
}

// Tour type (collection of sights)
export interface Tour {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  thumbnail?: string;
  stops: Sight[];
  category?: string;
  difficulty?: 'easy' | 'moderate' | 'challenging';
  featured?: boolean;
  downloadable?: boolean;
}

// Audio Player types
export type PlayerState = {
  isPlaying: boolean;
  positionMs: number;
  durationMs: number;
  sightId: string | null;
  variant: string | null;
  language: AudioLang;
  queue: QueueItem[] | null;
  queueIndex: number;
  queueTitle: string | null;
};

export type QueueItem = {
  sightId: string;
  variant: string;
  remoteUrl?: string;
  title?: string;
};

// Progress tracking
export type ProgressRecord = {
  sight_id: string;
  completed: number;
  last_played_variant: string | null;
  last_position: number;
  last_updated: number;
};

// Download tracking
export type DownloadRecord = {
  sight_id: string;
  variant: string;
  local_uri: string;
  downloaded_at?: number | null;
};

// Geofence
export interface GeofenceConfig {
  identifier: string;
  latitude: number;
  longitude: number;
  radius: number;
}
