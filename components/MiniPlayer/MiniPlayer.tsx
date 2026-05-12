import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudioPlayerContext } from '@context';
import { COLORS } from '@config';

interface MiniPlayerProps {
  track: {
    id: string;
    title: string;
    image?: string;
    audioUrl: string;
  };
  isPlaying: boolean;
  onPlayPause: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ track, isPlaying, onPlayPause }) => {
  const router = useRouter();
  const { position, duration, stopTrack } = useAudioPlayerContext();

  const handlePress = () => {
    router.push({
      pathname: '/player',
      params: { trackId: track.id }
    });
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        {/* Album Art */}
        <Image 
          source={{ uri: track.image || 'https://via.placeholder.com/60' }} 
          style={styles.albumArt}
        />

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            Vatican Audio Guide
          </Text>
        </View>

        {/* Play/Pause Button */}
        <TouchableOpacity 
          style={styles.playButton}
          onPress={(e) => {
            e.stopPropagation();
            onPlayPause();
          }}
        >
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={28} 
            color={COLORS.BLACK} 
          />
        </TouchableOpacity>

        {/* Close Button */}
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={(e) => {
            e.stopPropagation();
            stopTrack();
          }}
        >
          <Ionicons 
            name="close" 
            size={24} 
            color="rgba(0, 0, 0, 0.6)" 
          />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // Above bottom tab bar
    left: 0,
    right: 0,
    backgroundColor: COLORS.NAV,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: COLORS.SECONDARY,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.BLACK,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  playButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.VATICAN_GOLD,
  },
});
