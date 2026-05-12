import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useAudioPlayerContext } from '@context';
import { COLORS } from '@config';

const { width, height } = Dimensions.get('window');

export default function PlayerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    position, 
    duration,
    seekTo 
  } = useAudioPlayerContext();
  
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one

  // Use actual track data from context
  const track = currentTrack || {
    id: params.trackId || '1',
    title: 'Colosseum',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRepeat = () => {
    setRepeatMode((repeatMode + 1) % 3);
  };

  const handleSeek = async (value: number) => {
    await seekTo(value);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Background Image with subtle opacity */}
      <Image 
        source={{ uri: track.image }} 
        style={styles.backgroundImage}
        blurRadius={50}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-down" size={32} color={COLORS.BLACK} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>NOW PLAYING</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-horizontal" size={28} color={COLORS.BLACK} />
        </TouchableOpacity>
      </View>

      {/* Album Art */}
      <View style={styles.albumArtContainer}>
        <Image 
          source={{ uri: track.image }} 
          style={styles.albumArt}
        />
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{track.title}</Text>
        <Text style={styles.trackSubtitle}>Vatican Audio Guide</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor={COLORS.VATICAN_BLUE}
          maximumTrackTintColor="rgba(0, 0, 0, 0.2)"
          thumbTintColor={COLORS.VATICAN_BLUE}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => setIsShuffle(!isShuffle)}
        >
          <Ionicons 
            name="shuffle" 
            size={24} 
            color={isShuffle ? COLORS.VATICAN_GOLD : 'rgba(0, 0, 0, 0.6)'} 
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={36} color={COLORS.BLACK} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.playButton}
          onPress={togglePlayPause}
        >
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={40} 
            color={COLORS.BLACK} 
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={36} color={COLORS.BLACK} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handleRepeat}
        >
          <Ionicons 
            name={repeatMode === 2 ? 'repeat-outline' : 'repeat'} 
            size={24} 
            color={repeatMode > 0 ? COLORS.VATICAN_GOLD : 'rgba(0, 0, 0, 0.6)'} 
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={24} color="rgba(0, 0, 0, 0.7)" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="rgba(0, 0, 0, 0.7)" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.7)',
    letterSpacing: 1,
  },
  albumArtContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  albumArt: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 12,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
  },
  trackInfo: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  trackTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.VATICAN_BLUE,
    marginBottom: 8,
    textAlign: 'center',
  },
  trackSubtitle: {
    fontSize: 16,
    color: COLORS.BLACK,
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.GREY,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  controlButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.VATICAN_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: COLORS.VATICAN_BLUE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 60,
    marginTop: 'auto',
    marginBottom: 40,
  },
  actionButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


