import { useState, useCallback } from 'react';

interface AudioTrack {
  id: string;
  title: string;
  audioUrl: string;
  language: string;
  image?: string;
}

interface UseAudioPlayerReturn {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  stopTrack: () => void;
  togglePlayPause: () => void;
  getAudioUrl: (tourId: string, language: string) => string;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const getAudioUrl = useCallback((tourId: string, language: string): string => {
    const baseUrl = process.env.EXPO_PUBLIC_AUDIO_CDN_BASE_URL || '';
    // HLS playlist URL format: /audio/{language}/{tour-id}/deep/playlist.m3u8
    return `${baseUrl}/${language}/${tourId}/deep/playlist.m3u8`;
  }, []);

  const playTrack = useCallback((track: AudioTrack) => {
    console.log('[useAudioPlayer] Playing track:', track.title);
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const pauseTrack = useCallback(() => {
    console.log('[useAudioPlayer] Pausing track');
    setIsPlaying(false);
  }, []);

  const stopTrack = useCallback(() => {
    console.log('[useAudioPlayer] Stopping track');
    setCurrentTrack(null);
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    console.log('[useAudioPlayer] Toggling play/pause');
    setIsPlaying(prev => !prev);
  }, []);

  return {
    currentTrack,
    isPlaying,
    playTrack,
    pauseTrack,
    stopTrack,
    togglePlayPause,
    getAudioUrl,
  };
};
