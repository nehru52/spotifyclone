/**
 * GPS Monitor Component
 * Monitors for triggered locations and handles auto-play
 */

import React, { useEffect, useRef } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';
import { locationService, LocationPoint } from '../../src/services/locationService';
import { useAudioPlayerContext, useLanguage } from '../../context';
import { useRouter } from 'expo-router';

export const GPSMonitor: React.FC = () => {
  const { playTrack, getAudioUrl, currentTrack } = useAudioPlayerContext();
  const { language } = useLanguage();
  const router = useRouter();
  const appState = useRef(AppState.currentState);
  const checkInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Defer ALL initialization to avoid blocking app startup
    const initTimer = setTimeout(() => {
      initializeGPS().catch(err => console.error('[GPSMonitor] Init error:', err));
    }, 5000); // Wait 5 seconds after app loads

    // Listen for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Check for triggered locations periodically (start after init)
    const checkTimer = setTimeout(() => {
      startPeriodicCheck();
    }, 6000);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(checkTimer);
      subscription.remove();
      stopPeriodicCheck();
    };
  }, []);

  const initializeGPS = async () => {
    try {
      const settings = await locationService.getSettings();
      
      if (settings.enabled) {
        console.log('[GPSMonitor] GPS tracking is enabled, starting...');
        await locationService.startTracking();
      } else {
        console.log('[GPSMonitor] GPS tracking is disabled');
      }

      // Setup notifications
      await locationService.setupNotifications();
    } catch (error) {
      console.error('[GPSMonitor] Error initializing GPS:', error);
    }
  };

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('[GPSMonitor] App has come to foreground, checking for triggered locations...');
      await checkTriggeredLocation();
    }

    appState.current = nextAppState;
  };

  const startPeriodicCheck = () => {
    // Check every 10 seconds when app is active
    checkInterval.current = setInterval(async () => {
      await checkTriggeredLocation();
    }, 10000);
  };

  const stopPeriodicCheck = () => {
    if (checkInterval.current) {
      clearInterval(checkInterval.current);
      checkInterval.current = null;
    }
  };

  const checkTriggeredLocation = async () => {
    try {
      const triggeredLocation = await locationService.getTriggeredLocation();
      
      if (triggeredLocation) {
        console.log('[GPSMonitor] Triggered location found:', triggeredLocation.name);
        await handleTriggeredLocation(triggeredLocation);
      }
    } catch (error) {
      console.error('[GPSMonitor] Error checking triggered location:', error);
    }
  };

  const handleTriggeredLocation = async (location: LocationPoint) => {
    try {
      const settings = await locationService.getSettings();

      // Check if auto-play is enabled
      if (settings.autoPlayEnabled) {
        console.log('[GPSMonitor] Auto-play enabled, starting audio...');
        await startAudioForLocation(location);
      } else {
        // Show alert to let user manually start
        Alert.alert(
          `📍 You're near ${location.name}`,
          'Would you like to start the audio tour?',
          [
            { text: 'Not Now', style: 'cancel' },
            {
              text: 'Play Audio',
              onPress: async () => {
                await startAudioForLocation(location);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('[GPSMonitor] Error handling triggered location:', error);
    }
  };

  const startAudioForLocation = async (location: LocationPoint) => {
    try {
      // Use the app's current language
      const audioUrl = await getAudioUrl(location.id, language);

      console.log('[GPSMonitor] Starting audio for:', location.name, 'in language:', language);

      // Play the track
      await playTrack({
        id: location.id,
        title: location.name,
        audioUrl,
        language,
        image: '', // Will be set by the audio player
      });

      // Navigate to player screen
      router.push('/player');
    } catch (error) {
      console.error('[GPSMonitor] Error starting audio:', error);
      Alert.alert('Error', 'Could not start audio. Please try again.');
    }
  };

  // This component doesn't render anything
  return null;
};
