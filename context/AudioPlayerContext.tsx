import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { LogBox } from 'react-native';
import { downloadManager } from '../src/services/downloadManager';

// Ignore specific warnings in development
LogBox.ignoreLogs([
  '[Layout children]: No route named',
  'WARN  [Layout children]',
]);

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
  isLoading: boolean;
  duration: number;
  position: number;
  playTrack: (track: AudioTrack) => Promise<void>;
  pauseTrack: () => Promise<void>;
  stopTrack: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  getAudioUrl: (tourId: string, language: string) => Promise<string>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isUpdatingRef = useRef(false);

  // Configure audio mode once
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: false, // Don't lower volume for other apps
          playThroughEarpieceAndroid: false, // Use speaker, not earpiece
          allowsRecordingIOS: false,
          interruptionModeIOS: 2, // Do not mix - take full control
          interruptionModeAndroid: 2, // Do not mix - take full control
        });
        console.log('[Audio] Audio mode configured for maximum volume');
      } catch (error) {
        console.error('[Audio] Config error:', error);
      }
    };
    configureAudio();
  }, []);

  // Update playback status - throttled to prevent loops
  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    try {
      if (status.isLoaded) {
        setPosition(Math.floor(status.positionMillis / 1000));
        if (status.durationMillis) {
          setDuration(Math.floor(status.durationMillis / 1000));
        }
        setIsPlaying(status.isPlaying);
        
        if (status.didJustFinish) {
          setIsPlaying(false);
          setPosition(0);
        }
      } else if (status.error) {
        console.error('[Audio] Playback error:', status.error);
        setIsLoading(false);
        setIsPlaying(false);
      }
    } finally {
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, []);

  const getAudioUrl = useCallback(async (tourId: string, language: string): Promise<string> => {
    try {
      const audioPath = await downloadManager.getAudioPath(tourId, language);
      console.log('[Audio] Audio path:', audioPath);
      return audioPath;
    } catch (error) {
      console.error('[Audio] Error getting audio path:', error);
      // Fallback to remote URL
      const AUDIO_CDN_BASE_URL = process.env.EXPO_PUBLIC_AUDIO_CDN_BASE_URL || '';
      return `${AUDIO_CDN_BASE_URL}/${language}/${tourId}/deep/playlist.m3u8`;
    }
  }, []);

  const playTrack = useCallback(async (track: AudioTrack) => {
    try {
      console.log('[Audio] ========================================');
      console.log('[Audio] Playing:', track.title);
      console.log('[Audio] Audio URL:', track.audioUrl);
      console.log('[Audio] Language:', track.language);
      setIsLoading(true);

      // Unload previous sound
      if (soundRef.current) {
        try {
          console.log('[Audio] Unloading previous sound...');
          await soundRef.current.unloadAsync();
        } catch (e) {
          console.log('[Audio] Unload error (ignored):', e);
        }
        soundRef.current = null;
      }

      console.log('[Audio] Creating new sound object...');
      // Create and load new sound with maximum volume
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { 
          shouldPlay: true, 
          progressUpdateIntervalMillis: 500,
          volume: 1.0, // Maximum volume
          isMuted: false,
        },
        onPlaybackStatusUpdate
      );

      console.log('[Audio] Sound created successfully');
      
      // Set volume to maximum
      await sound.setVolumeAsync(1.0);
      console.log('[Audio] Volume set to maximum (1.0)');

      soundRef.current = sound;
      setCurrentTrack(track);
      setIsPlaying(true);
      setIsLoading(false);
      console.log('[Audio] Playback started successfully');
      console.log('[Audio] ========================================');
    } catch (error) {
      console.error('[Audio] ========================================');
      console.error('[Audio] Play error:', error);
      console.error('[Audio] Error details:', JSON.stringify(error, null, 2));
      console.error('[Audio] ========================================');
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [onPlaybackStatusUpdate]);

  const pauseTrack = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('[Audio] Pause error:', error);
    }
  }, []);

  const stopTrack = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setCurrentTrack(null);
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
    } catch (error) {
      console.error('[Audio] Stop error:', error);
    }
  }, []);

  const togglePlayPause = useCallback(async () => {
    try {
      console.log('[Audio] Toggle play/pause, current sound:', !!soundRef.current);
      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        console.log('[Audio] Current status:', status.isLoaded ? (status.isPlaying ? 'playing' : 'paused') : 'not loaded');
        
        if (status.isLoaded) {
          if (status.isPlaying) {
            console.log('[Audio] Pausing...');
            await soundRef.current.pauseAsync();
            setIsPlaying(false);
          } else {
            console.log('[Audio] Playing...');
            await soundRef.current.playAsync();
            setIsPlaying(true);
          }
        }
      } else {
        console.log('[Audio] No sound loaded');
      }
    } catch (error) {
      console.error('[Audio] Toggle error:', error);
    }
  }, []);

  const seekTo = useCallback(async (positionSeconds: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(positionSeconds * 1000);
      }
    } catch (error) {
      console.error('[Audio] Seek error:', error);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        duration,
        position,
        playTrack,
        pauseTrack,
        stopTrack,
        togglePlayPause,
        seekTo,
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
