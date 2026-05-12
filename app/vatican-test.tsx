import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchTours } from '../src/services/content';
import { Tour } from '../src/types';
import Constants from 'expo-constants';
import { AudioPlayer } from '../src/components/AudioPlayer';
import { useAudioPlayer } from '../src/hooks/useAudioPlayer';

export default function VaticanTest() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentTrack, playTrack, getAudioUrl } = useAudioPlayer();

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTours();
      setTours(data);
    } catch (err) {
      console.error('[VaticanTest] Error loading tours:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTour = (tour: Tour) => {
    const audioUrl = getAudioUrl(tour.id, 'en'); // Default to English
    playTrack({
      id: tour.id,
      title: tour.title,
      audioUrl,
      language: 'en',
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffd700" />
        <Text style={styles.loadingText}>Loading Tours...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>⚠️ Error Loading Tours</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadTours}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.title}>🏛️ Vatican Audio Guide</Text>
        <Text style={styles.subtitle}>Discover the Wonders of Vatican City</Text>
      </View>

      {/* Audio Player (Fixed when playing) */}
      {currentTrack && (
        <View style={styles.playerContainer}>
          <AudioPlayer
            audioUrl={currentTrack.audioUrl}
            title={currentTrack.title}
            onComplete={() => console.log('Audio completed')}
            onError={(err) => console.error('Audio error:', err)}
          />
        </View>
      )}

      {tours.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Tours Found</Text>
          <Text style={styles.emptyText}>
            No tours are available at the moment.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTours}>
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {tours.map((tour) => (
            <View key={tour.id} style={styles.tourCard}>
              {tour.thumbnail && (
                <Image
                  source={{ uri: tour.thumbnail }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              )}
              <View style={styles.tourInfo}>
                <Text style={styles.tourTitle}>{tour.title}</Text>
                <Text style={styles.tourDescription}>{tour.description}</Text>
                <View style={styles.tourMeta}>
                  {tour.duration && (
                    <Text style={styles.metaText}>⏱️ {tour.duration}</Text>
                  )}
                  {tour.category && (
                    <Text style={styles.metaText}>📍 {tour.category}</Text>
                  )}
                  {tour.stops && tour.stops.length > 0 && (
                    <Text style={styles.metaText}>🎧 {tour.stops.length} stops</Text>
                  )}
                  {tour.difficulty && (
                    <Text style={styles.metaText}>
                      {tour.difficulty === 'easy' ? '🟢' : tour.difficulty === 'moderate' ? '🟡' : '🔴'} {tour.difficulty}
                    </Text>
                  )}
                </View>
                
                {/* Play Button */}
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => handlePlayTour(tour)}
                >
                  <Text style={styles.playButtonText}>▶️ Play Audio Tour</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#003366',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#002244',
    borderBottomWidth: 2,
    borderBottomColor: '#ffd700',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 12,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  tourCard: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  tourInfo: {
    padding: 16,
  },
  tourTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 8,
  },
  tourDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  tourMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  playerContainer: {
    padding: 16,
    backgroundColor: '#002244',
  },
  playButton: {
    backgroundColor: '#ffd700',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
});
