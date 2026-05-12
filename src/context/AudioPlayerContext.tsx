import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AudioTrack {
  id: string;
  title: string;
  audioUrl: string;
  language: string;
  image?: string;
}

interface AudioPlayerContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  stopTrack: () => void;
  togglePlayPause: () => void;
  getAudioUrl: (tourId: string, language: string) => string;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const getAudioUrl = useCallback((tourId: string, language: string): string => {
    const baseUrl = process.env.EXPO_PUBLIC_AUDIO_CDN_BASE_URL || '';
    return `${baseUrl}/${language}/${tourId}/deep/playlist.m3u8`;
  }, []);

  const playTrack = useCallback((track: AudioTrack) => {
    console.log('[AudioPlayerContext] Playing track:', track.title);
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const pauseTrack = useCallback(() => {
    console.log('[AudioPlayerContext] Pausing track');
    setIsPlaying(false);
  }, []);

  const stopTrack = useCallback(() => {
    console.log('[AudioPlayerContext] Stopping track');
    setCurrentTrack(null);
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    console.log('[AudioPlayerContext] Toggling play/pause');
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        pauseTrack,
        stopTrack,
        togglePlayPause,
        getAudioUrl,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayerContext must be used within an AudioPlayerProvider');
  }
  return context;
};
