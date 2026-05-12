import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAudioPlayerContext, useLanguage } from '@context';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@config';
import { Ionicons } from '@expo/vector-icons';
import { fetchToursFromSanity, SanityTour } from '../../../src/services/tours';
import { downloadManager } from '../../../src/services/downloadManager';
import { weatherService, WeatherData } from '../../../src/services/weatherService';
import { locationService } from '../../../src/services/locationService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.35; // Reduced from 0.42 to make cards smaller
const CARD_HEIGHT = 180; // Fixed height for consistency
const RECENT_CARD_WIDTH = width * 0.7; // Wider cards for recent section
const RECENT_CARD_HEIGHT = 100;

interface RecentTrack {
  id: string;
  title: string;
  image: string;
  language: string;
  pausedAt: number; // in seconds
  duration: number; // in seconds
  lastPlayed: number; // timestamp
}

// Vatican Places - Exact names from audio files
const VATICAN_PLACES = [
  {
    id: 'colosseum',
    title: 'Colosseum',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
    duration: '0 min', // Will be updated dynamically
  },
  {
    id: 'forum',
    title: 'Roman Forum',
    image: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=600&q=80',
    duration: '0 min',
  },
  {
    id: 'heart',
    title: 'Heart of Rome',
    image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&q=80',
    duration: '0 min',
  },
  {
    id: 'jewish-ghetto',
    title: 'Jewish Ghetto',
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80',
    duration: '0 min',
  },
  {
    id: 'ostia-antica',
    title: 'Ostia Antica',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=80',
    duration: '0 min',
  },
  {
    id: 'pantheon',
    title: 'Pantheon',
    image: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=600&q=80',
    duration: '0 min',
  },
  {
    id: 'sistine-chapel',
    title: 'Sistine Chapel',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
    duration: '0 min',
  },
  {
    id: 'st-peters-basilica',
    title: "St. Peter's Basilica",
    image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=600&q=80',
    duration: '0 min',
  },
  {
    id: 'trastevere',
    title: 'Trastevere',
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80',
    duration: '0 min',
  },
  {
    id: 'vatican-museums',
    title: 'Vatican Museums',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
    duration: '0 min',
  },
  {
    id: 'vatican-pinacoteca',
    title: 'Vatican Pinacoteca',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80',
    duration: '0 min',
  },
];

// Languages
const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export default function HomeScreen() {
  const { translations, language: appLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(appLanguage);
  const [audioDurations, setAudioDurations] = useState<{ [key: string]: string }>({});
  const [loadingDurations, setLoadingDurations] = useState(true);
  const [recentTracks, setRecentTracks] = useState<RecentTrack[]>([]);
  const [downloadedTours, setDownloadedTours] = useState<Set<string>>(new Set());
  const [downloadingTours, setDownloadingTours] = useState<Set<string>>(new Set());
  const [downloadProgress, setDownloadProgress] = useState<Map<string, number>>(new Map());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const { currentTrack, playTrack, getAudioUrl, position, duration } = useAudioPlayerContext();
  const router = useRouter();

  // Sync selected language with app language
  useEffect(() => {
    setSelectedLanguage(appLanguage);
  }, [appLanguage]);

  // Load weather data (completely non-blocking)
  useEffect(() => {
    let isMounted = true;
    
    const loadWeather = async () => {
      try {
        // Load weather in background without blocking
        const location = await locationService.getCurrentLocation();
        let weatherData;
        
        if (location) {
          weatherData = await weatherService.fetchWeather(
            location.coords.latitude,
            location.coords.longitude
          );
        } else {
          weatherData = await weatherService.fetchWeather();
        }
        
        if (isMounted) {
          setWeather(weatherData);
          setLoadingWeather(false);
        }
      } catch (error) {
        console.error('[HomeScreen] Error loading weather:', error);
        // Set mock weather on error so widget still shows
        if (isMounted) {
          setWeather({
            temp: 22,
            feelsLike: 21,
            description: 'partly cloudy',
            icon: 'partly-sunny',
            humidity: 65,
            windSpeed: 12,
            timestamp: Date.now(),
          });
          setLoadingWeather(false);
        }
      }
    };

    // Load weather after screen is rendered
    const timer = setTimeout(() => {
      loadWeather();
    }, 1000);
    
    // Refresh weather every 30 minutes
    const interval = setInterval(() => {
      if (isMounted) loadWeather();
    }, 30 * 60 * 1000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      isMounted = false;
    };
  }, []);

  // Load recent tracks from storage
  useEffect(() => {
    const loadRecentTracks = async () => {
      try {
        const stored = await AsyncStorage.getItem('recent_tracks');
        if (stored) {
          const tracks: RecentTrack[] = JSON.parse(stored);
          // Sort by last played (most recent first)
          tracks.sort((a, b) => b.lastPlayed - a.lastPlayed);
          setRecentTracks(tracks.slice(0, 10)); // Keep only last 10
        }
      } catch (error) {
        console.error('[HomeScreen] Error loading recent tracks:', error);
      }
    };
    loadRecentTracks();
  }, []);

  // Check which tours are downloaded
  useEffect(() => {
    const checkDownloads = async () => {
      const downloaded = new Set<string>();
      for (const place of VATICAN_PLACES) {
        const isDownloaded = await downloadManager.isDownloaded(place.id, selectedLanguage);
        if (isDownloaded) {
          downloaded.add(`${place.id}_${selectedLanguage}`);
        }
      }
      setDownloadedTours(downloaded);
    };
    checkDownloads();
  }, [selectedLanguage]);

  // Save current track to recent when paused or changed
  useEffect(() => {
    const saveRecentTrack = async () => {
      if (currentTrack && position > 5) { // Only save if played for more than 5 seconds
        try {
          const stored = await AsyncStorage.getItem('recent_tracks');
          let tracks: RecentTrack[] = stored ? JSON.parse(stored) : [];
          
          // Remove existing entry for this track
          tracks = tracks.filter(t => t.id !== currentTrack.id);
          
          // Add new entry at the beginning
          const newTrack: RecentTrack = {
            id: currentTrack.id,
            title: currentTrack.title,
            image: currentTrack.image || '',
            language: currentTrack.language,
            pausedAt: position,
            duration: duration,
            lastPlayed: Date.now(),
          };
          
          tracks.unshift(newTrack);
          
          // Keep only last 10
          tracks = tracks.slice(0, 10);
          
          await AsyncStorage.setItem('recent_tracks', JSON.stringify(tracks));
          setRecentTracks(tracks);
        } catch (error) {
          console.error('[HomeScreen] Error saving recent track:', error);
        }
      }
    };

    // Save every 10 seconds while playing
    const interval = setInterval(saveRecentTrack, 10000);
    return () => clearInterval(interval);
  }, [currentTrack, position, duration]);

  // Load audio durations in background (non-blocking)
  useEffect(() => {
    let isMounted = true;
    
    const loadAudioDurations = async () => {
      // Don't block UI - load in background
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setLoadingDurations(true);
      const durations: { [key: string]: string } = {};

      // Load durations sequentially but with a smaller footprint
      for (const place of VATICAN_PLACES) {
        if (!isMounted) break;
        try {
          const audioUrl = await getAudioUrl(place.id, selectedLanguage);
          
          const { sound } = await Audio.Sound.createAsync(
            { uri: audioUrl },
            { shouldPlay: false }
          );

          const status = await sound.getStatusAsync();
          if (status.isLoaded && status.durationMillis && status.durationMillis > 0) {
            const minutes = Math.floor(status.durationMillis / 60000);
            const seconds = Math.floor((status.durationMillis % 60000) / 1000);
            durations[place.id] = seconds > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${minutes} ${translations.time.min}`;
          } else {
            durations[place.id] = 'N/A';
          }

          await sound.unloadAsync();
          
          // Update UI progressively as each duration loads
          if (isMounted) {
            setAudioDurations(prev => ({ ...prev, [place.id]: durations[place.id] }));
          }
        } catch (error) {
          durations[place.id] = 'N/A';
          if (isMounted) {
            setAudioDurations(prev => ({ ...prev, [place.id]: 'N/A' }));
          }
        }
      }

      if (isMounted) {
        setLoadingDurations(false);
      }
    };

    // Start loading after a delay to not block initial render
    const timer = setTimeout(() => {
      loadAudioDurations();
    }, 500);
    
    return () => { 
      clearTimeout(timer);
      isMounted = false; 
    };
  }, [selectedLanguage, getAudioUrl, translations.time.min]);

  const handlePlayPlace = async (place: typeof VATICAN_PLACES[0]) => {
    console.log('[HomeScreen] ========================================');
    console.log('[HomeScreen] User tapped:', place.title);
    console.log('[HomeScreen] Place ID:', place.id);
    console.log('[HomeScreen] Selected language:', selectedLanguage);
    
    const audioUrl = await getAudioUrl(place.id, selectedLanguage);
    console.log('[HomeScreen] Generated audio URL:', audioUrl);
    console.log('[HomeScreen] Calling playTrack...');
    
    playTrack({
      id: place.id,
      title: place.title,
      audioUrl,
      language: selectedLanguage,
      image: place.image,
    });
    
    console.log('[HomeScreen] playTrack called');
    console.log('[HomeScreen] ========================================');
  };

  const handlePlayRecent = async (track: RecentTrack) => {
    const audioUrl = await getAudioUrl(track.id, track.language);
    playTrack({
      id: track.id,
      title: track.title,
      audioUrl,
      language: track.language,
      image: track.image,
    });
    // Seek to the paused position after a short delay
    setTimeout(() => {
      // The seek will happen in the audio player context
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (pausedAt: number, duration: number) => {
    if (duration === 0) return 0;
    return Math.min((pausedAt / duration) * 100, 100);
  };

  const handleDownloadTour = async (place: typeof VATICAN_PLACES[0], event: any) => {
    event.stopPropagation(); // Prevent playing audio when tapping download
    
    const downloadKey = `${place.id}_${selectedLanguage}`;
    
    // Check if already downloaded
    if (downloadedTours.has(downloadKey)) {
      Alert.alert(translations.home.alreadyDownloaded, `${place.title} ${translations.home.alreadyDownloadedMsg}`);
      return;
    }

    // Check if already downloading
    if (downloadingTours.has(downloadKey)) {
      Alert.alert(translations.home.downloadInProgress, translations.home.downloadInProgressMsg);
      return;
    }

    try {
      setDownloadingTours(prev => new Set(prev).add(downloadKey));

      const success = await downloadManager.downloadTour(
        place.id,
        place.title,
        selectedLanguage,
        place.image,
        (progress) => {
          setDownloadProgress(prev => {
            const newMap = new Map(prev);
            newMap.set(downloadKey, progress.progress);
            return newMap;
          });
        }
      );

      if (success) {
        setDownloadedTours(prev => new Set(prev).add(downloadKey));
        Alert.alert(`✅ ${translations.home.downloadComplete}`, `${place.title} ${translations.home.downloadCompleteMsg}`);
      } else {
        Alert.alert(`❌ ${translations.home.downloadFailed}`, translations.home.downloadFailedMsg);
      }
    } catch (error) {
      console.error('[HomeScreen] Download error:', error);
      Alert.alert(translations.home.downloadError, translations.home.downloadErrorMsg);
    } finally {
      setDownloadingTours(prev => {
        const newSet = new Set(prev);
        newSet.delete(downloadKey);
        return newSet;
      });
      setDownloadProgress(prev => {
        const newMap = new Map(prev);
        newMap.delete(downloadKey);
        return newMap;
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{translations.home.title}</Text>
        <Text style={styles.headerSubtitle}>{translations.home.subtitle}</Text>
      </View>

      {/* Weather Widget - Lower Left */}
      {weather && !loadingWeather && (
        <View style={styles.weatherWidget}>
          <View style={styles.weatherContent}>
            <Ionicons name={weather.icon} size={32} color={COLORS.VATICAN_GOLD} />
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherTemp}>{weather.temp}°C</Text>
              <Text style={styles.weatherDesc}>{weather.description}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Language Tabs (Horizontal Scroll) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.languageTabsContainer}
        contentContainerStyle={styles.languageTabsContent}
      >
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageTab,
              selectedLanguage === lang.code && styles.languageTabActive,
            ]}
            onPress={() => setSelectedLanguage(lang.code)}
          >
            <Text style={styles.languageFlag}>{lang.flag}</Text>
            <Text
              style={[
                styles.languageLabel,
                selectedLanguage === lang.code && styles.languageLabelActive,
              ]}
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recently Played Section */}
        {recentTracks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translations.home.recentlyPlayed}</Text>
            <Text style={styles.sectionSubtitle}>
              {translations.home.continueListening}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentContainer}
            >
              {recentTracks.map((track) => (
                <TouchableOpacity
                  key={`${track.id}-${track.lastPlayed}`}
                  style={styles.recentCard}
                  onPress={() => handlePlayRecent(track)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: track.image }}
                    style={styles.recentImage}
                    resizeMode="cover"
                  />
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentTitle} numberOfLines={1}>
                      {track.title}
                    </Text>
                    <Text style={styles.recentLanguage}>
                      {LANGUAGES.find(l => l.code === track.language)?.label || track.language}
                    </Text>
                    <View style={styles.recentProgress}>
                      <View style={styles.recentProgressBar}>
                        <View 
                          style={[
                            styles.recentProgressFill, 
                            { width: `${getProgressPercentage(track.pausedAt, track.duration)}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.recentTime}>
                        {formatTime(track.pausedAt)} / {formatTime(track.duration)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.recentPlayIcon}>
                    <Text style={styles.playIconText}>▶️</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Vatican Places Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.home.romePlaces}</Text>
          <Text style={styles.sectionSubtitle}>
            {translations.home.exploreLocations}
          </Text>

          {/* Horizontal Scrollable Places */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.placesContainer}
          >
            {VATICAN_PLACES.map((place) => {
              const downloadKey = `${place.id}_${selectedLanguage}`;
              const isDownloaded = downloadedTours.has(downloadKey);
              const isDownloading = downloadingTours.has(downloadKey);
              const progress = downloadProgress.get(downloadKey) || 0;

              return (
              <TouchableOpacity
                key={place.id}
                style={styles.placeCard}
                onPress={() => handlePlayPlace(place)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: place.image }}
                  style={styles.placeImage}
                  resizeMode="cover"
                />
                <View style={styles.placeOverlay}>
                  <View style={styles.playIconContainer}>
                    <Ionicons name="play" size={32} color={COLORS.WHITE} />
                  </View>
                </View>
                
                {/* Download Button */}
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={(e) => handleDownloadTour(place, e)}
                  disabled={isDownloaded || isDownloading}
                >
                  {isDownloading ? (
                    <View style={styles.downloadingContainer}>
                      <ActivityIndicator size="small" color={COLORS.WHITE} />
                      <Text style={styles.downloadProgressText}>{Math.round(progress * 100)}%</Text>
                    </View>
                  ) : isDownloaded ? (
                    <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                  ) : (
                    <Ionicons name="download-outline" size={28} color={COLORS.WHITE} />
                  )}
                </TouchableOpacity>

                <View style={styles.placeInfo}>
                  <Text style={styles.placeTitle} numberOfLines={2}>
                    {place.title}
                  </Text>
                  <Text style={styles.placeDuration}>
                    ⏱️ {loadingDurations ? '...' : (audioDurations[place.id] || place.duration)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
            })}
          </ScrollView>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.VATICAN_GOLD,
    fontSize: 16,
    marginTop: 12,
    fontFamily: 'Avenir Next',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  header: {
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: COLORS.NAV,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.VATICAN_BLUE,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.VATICAN_BLUE,
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'Avenir Next',
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.VATICAN_BLUE,
    textAlign: 'center',
    fontFamily: 'Avenir Next',
  },
  weatherWidget: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 165, 116, 0.3)',
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weatherInfo: {
    flexDirection: 'column',
  },
  weatherTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  weatherDesc: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'capitalize',
  },
  languageTabsContainer: {
    backgroundColor: COLORS.NAV,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    maxHeight: 60,
  },
  languageTabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    alignItems: 'center',
  },
  languageTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    height: 36,
    minWidth: 90,
    maxWidth: 120,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  languageTabActive: {
    backgroundColor: COLORS.VATICAN_BLUE,
    borderColor: COLORS.VATICAN_BLUE,
    borderWidth: 1,
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.BLACK,
  },
  languageLabelActive: {
    color: COLORS.WHITE,
    fontWeight: '600',
  },

  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.VATICAN_BLUE,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.BLACK,
    opacity: 0.7,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  placesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  placeCard: {
    width: CARD_WIDTH,
    marginHorizontal: 8,
    marginVertical: 12,
    borderRadius: 16,
    backgroundColor: COLORS.SECONDARY,
    overflow: 'visible', // Allow shadow to show
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  placeImage: {
    width: '100%',
    height: CARD_HEIGHT,
    backgroundColor: COLORS.NAV,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  placeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  playIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.VATICAN_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.VATICAN_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  playIcon: {
    fontSize: 24,
  },
  placeInfo: {
    padding: 12,
    backgroundColor: COLORS.SECONDARY,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  placeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  placeDuration: {
    fontSize: 12,
    color: COLORS.BLACK,
    fontWeight: '600',
  },
  recentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  recentCard: {
    width: RECENT_CARD_WIDTH,
    height: RECENT_CARD_HEIGHT,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: COLORS.SECONDARY,
    overflow: 'visible',
    flexDirection: 'row',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  recentImage: {
    width: RECENT_CARD_HEIGHT,
    height: RECENT_CARD_HEIGHT,
    backgroundColor: COLORS.NAV,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  recentInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  recentLanguage: {
    fontSize: 12,
    color: COLORS.VATICAN_GOLD,
    marginBottom: 8,
  },
  recentProgress: {
    gap: 4,
  },
  recentProgressBar: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  recentProgressFill: {
    height: '100%',
    backgroundColor: COLORS.VATICAN_GOLD,
    borderRadius: 2,
  },
  recentTime: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  recentPlayIcon: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    fontSize: 24,
  },
  bottomSpacer: {
    height: 40,
  },
  downloadButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  downloadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadProgressText: {
    color: COLORS.WHITE,
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 2,
  },
  downloadBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
