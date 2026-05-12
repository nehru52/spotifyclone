import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../config';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  onComplete?: () => void;
  onError?: (error: any) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  title,
  onComplete,
  onError,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    loadAudio();
    return () => {
      unloadAudio();
    };
  }, [audioUrl]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Load new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      setIsLoading(false);
      console.log('[AudioPlayer] Loaded:', title);
    } catch (err) {
      console.error('[AudioPlayer] Load error:', err);
      setError('Failed to load audio');
      setIsLoading(false);
      onError?.(err);
    }
  };

  const unloadAudio = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      } catch (err) {
        console.error('[AudioPlayer] Unload error:', err);
      }
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setCurrentTime(0);
        onComplete?.();
      }
    } else if (status.error) {
      console.error('[AudioPlayer] Playback error:', status.error);
      setError('Playback error');
      onError?.(status.error);
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } catch (err) {
      console.error('[AudioPlayer] Play/Pause error:', err);
      setError('Playback error');
    }
  };

  const seekTo = async (position: number) => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.setPositionAsync(position * 1000);
      setCurrentTime(position);
    } catch (err) {
      console.error('[AudioPlayer] Seek error:', err);
    }
  };

  const skip = async (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    await seekTo(newTime);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.playerCard}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(currentTime / duration) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              {/* Skip Backward */}
              <TouchableOpacity
                onPress={() => skip(-10)}
                style={styles.controlButton}
                disabled={isLoading}
              >
                <Ionicons name="play-back" size={32} color={COLORS.VATICAN_GOLD} />
                <Text style={styles.skipText}>10s</Text>
              </TouchableOpacity>

              {/* Play/Pause */}
              <TouchableOpacity
                onPress={togglePlayPause}
                style={styles.playButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color={COLORS.VATICAN_GOLD} />
                ) : (
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={48}
                    color={COLORS.PRIMARY}
                  />
                )}
              </TouchableOpacity>

              {/* Skip Forward */}
              <TouchableOpacity
                onPress={() => skip(10)}
                style={styles.controlButton}
                disabled={isLoading}
              >
                <Ionicons name="play-forward" size={32} color={COLORS.VATICAN_GOLD} />
                <Text style={styles.skipText}>10s</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  playerCard: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.VATICAN_GOLD,
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 2,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.VATICAN_GOLD,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.VATICAN_GOLD,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 10,
    color: COLORS.VATICAN_GOLD,
    marginTop: 4,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.VATICAN_GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.VATICAN_GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 20,
  },
});
