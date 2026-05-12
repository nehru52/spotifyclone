/**
 * Location Service with Geofencing
 * Handles GPS tracking and automatic audio playback when entering location zones
 */

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';
const GEOFENCE_RADIUS = 50; // meters
const SETTINGS_KEY = 'gps_autoplay_settings';

export interface LocationPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius?: number; // Optional custom radius
}

export interface GPSSettings {
  enabled: boolean;
  autoPlayEnabled: boolean;
  notificationsEnabled: boolean;
  radius: number; // Default radius in meters
}

// Vatican & Rome Places with GPS coordinates
export const LOCATION_POINTS: LocationPoint[] = [
  {
    id: 'colosseum',
    name: 'Colosseum',
    latitude: 41.8902,
    longitude: 12.4922,
  },
  {
    id: 'forum',
    name: 'Roman Forum',
    latitude: 41.8925,
    longitude: 12.4853,
  },
  {
    id: 'heart',
    name: 'Heart of Rome',
    latitude: 41.9009,
    longitude: 12.4833,
  },
  {
    id: 'jewish-ghetto',
    name: 'Jewish Ghetto',
    latitude: 41.8919,
    longitude: 12.4778,
  },
  {
    id: 'ostia-antica',
    name: 'Ostia Antica',
    latitude: 41.7569,
    longitude: 12.2925,
  },
  {
    id: 'pantheon',
    name: 'Pantheon',
    latitude: 41.8986,
    longitude: 12.4769,
  },
  {
    id: 'sistine-chapel',
    name: 'Sistine Chapel',
    latitude: 41.9029,
    longitude: 12.4545,
  },
  {
    id: 'st-peters-basilica',
    name: "St. Peter's Basilica",
    latitude: 41.9022,
    longitude: 12.4539,
  },
  {
    id: 'trastevere',
    name: 'Trastevere',
    latitude: 41.8897,
    longitude: 12.4689,
  },
  {
    id: 'vatican-museums',
    name: 'Vatican Museums',
    latitude: 41.9065,
    longitude: 12.4536,
  },
  {
    id: 'vatican-pinacoteca',
    name: 'Vatican Pinacoteca',
    latitude: 41.9043,
    longitude: 12.4531,
  },
];

class LocationService {
  private locationSubscription: Location.LocationSubscription | null = null;
  private lastTriggeredLocation: string | null = null;
  private lastTriggeredTime: number = 0;
  private readonly TRIGGER_COOLDOWN = 300000; // 5 minutes in milliseconds

  /**
   * Get default GPS settings
   */
  private getDefaultSettings(): GPSSettings {
    return {
      enabled: false,
      autoPlayEnabled: false,
      notificationsEnabled: true,
      radius: GEOFENCE_RADIUS,
    };
  }

  /**
   * Get current GPS settings
   */
  async getSettings(): Promise<GPSSettings> {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return this.getDefaultSettings();
    } catch (error) {
      console.error('[LocationService] Error getting settings:', error);
      return this.getDefaultSettings();
    }
  }

  /**
   * Update GPS settings
   */
  async updateSettings(settings: Partial<GPSSettings>): Promise<void> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      console.log('[LocationService] Settings updated:', updated);

      // Restart tracking if enabled changed
      if (settings.enabled !== undefined) {
        if (settings.enabled) {
          await this.startTracking();
        } else {
          await this.stopTracking();
        }
      }
    } catch (error) {
      console.error('[LocationService] Error updating settings:', error);
    }
  }

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      console.log('[LocationService] Requesting permissions...');

      // Request foreground permission first
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        console.log('[LocationService] Foreground permission denied');
        return false;
      }

      console.log('[LocationService] Foreground permission granted');

      // Request background permission (iOS and Android 10+)
      if (Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version >= 29)) {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        
        if (backgroundStatus !== 'granted') {
          console.log('[LocationService] Background permission denied');
          // Still return true as foreground is enough for basic functionality
          return true;
        }

        console.log('[LocationService] Background permission granted');
      }

      return true;
    } catch (error) {
      console.error('[LocationService] Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * Check if location permissions are granted
   */
  async hasPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('[LocationService] Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Check if user is near any location
   */
  async checkNearbyLocations(
    userLat: number,
    userLon: number
  ): Promise<LocationPoint | null> {
    const settings = await this.getSettings();
    const radius = settings.radius || GEOFENCE_RADIUS;

    for (const location of LOCATION_POINTS) {
      const distance = this.calculateDistance(
        userLat,
        userLon,
        location.latitude,
        location.longitude
      );

      const locationRadius = location.radius || radius;

      if (distance <= locationRadius) {
        console.log(`[LocationService] User is near ${location.name} (${distance.toFixed(0)}m away)`);
        return location;
      }
    }

    return null;
  }

  /**
   * Handle location update
   */
  private async handleLocationUpdate(location: Location.LocationObject): Promise<void> {
    try {
      const { latitude, longitude } = location.coords;
      console.log(`[LocationService] Location update: ${latitude}, ${longitude}`);

      const nearbyLocation = await this.checkNearbyLocations(latitude, longitude);

      if (nearbyLocation) {
        // Check cooldown to avoid repeated triggers
        const now = Date.now();
        if (
          this.lastTriggeredLocation === nearbyLocation.id &&
          now - this.lastTriggeredTime < this.TRIGGER_COOLDOWN
        ) {
          console.log(`[LocationService] Cooldown active for ${nearbyLocation.name}`);
          return;
        }

        // Update last triggered
        this.lastTriggeredLocation = nearbyLocation.id;
        this.lastTriggeredTime = now;

        // Trigger notification or auto-play
        await this.triggerLocationEvent(nearbyLocation);
      }
    } catch (error) {
      console.error('[LocationService] Error handling location update:', error);
    }
  }

  /**
   * Trigger location event (notification or auto-play)
   */
  private async triggerLocationEvent(location: LocationPoint): Promise<void> {
    try {
      const settings = await this.getSettings();

      console.log(`[LocationService] Triggering event for ${location.name}`);

      // Store the triggered location for the app to handle
      await AsyncStorage.setItem('triggered_location', JSON.stringify(location));

      // Send notification if enabled
      if (settings.notificationsEnabled) {
        await this.sendLocationNotification(location);
      }

      // Auto-play will be handled by the app when it reads 'triggered_location'
    } catch (error) {
      console.error('[LocationService] Error triggering location event:', error);
    }
  }

  /**
   * Send notification when near a location
   */
  private async sendLocationNotification(location: LocationPoint): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `📍 You're near ${location.name}`,
          body: 'Tap to start the audio tour',
          data: { locationId: location.id },
          sound: true,
        },
        trigger: null, // Send immediately
      });

      console.log(`[LocationService] Notification sent for ${location.name}`);
    } catch (error) {
      console.error('[LocationService] Error sending notification:', error);
    }
  }

  /**
   * Start location tracking
   */
  async startTracking(): Promise<boolean> {
    try {
      const hasPermission = await this.hasPermissions();
      if (!hasPermission) {
        console.log('[LocationService] No permissions, requesting...');
        const granted = await this.requestPermissions();
        if (!granted) {
          console.log('[LocationService] Permissions denied');
          return false;
        }
      }

      const settings = await this.getSettings();
      if (!settings.enabled) {
        console.log('[LocationService] GPS tracking is disabled in settings');
        return false;
      }

      // Stop existing subscription
      if (this.locationSubscription) {
        await this.stopTracking();
      }

      console.log('[LocationService] Starting location tracking...');

      // Start foreground location tracking
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 30000, // Update every 30 seconds
          distanceInterval: 20, // Or when moved 20 meters
        },
        (location) => {
          this.handleLocationUpdate(location);
        }
      );

      console.log('[LocationService] Location tracking started');
      return true;
    } catch (error) {
      console.error('[LocationService] Error starting tracking:', error);
      return false;
    }
  }

  /**
   * Stop location tracking
   */
  async stopTracking(): Promise<void> {
    try {
      if (this.locationSubscription) {
        this.locationSubscription.remove();
        this.locationSubscription = null;
        console.log('[LocationService] Location tracking stopped');
      }
    } catch (error) {
      console.error('[LocationService] Error stopping tracking:', error);
    }
  }

  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const hasPermission = await this.hasPermissions();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return location;
    } catch (error) {
      console.error('[LocationService] Error getting current location:', error);
      return null;
    }
  }

  /**
   * Get triggered location (if any)
   */
  async getTriggeredLocation(): Promise<LocationPoint | null> {
    try {
      const stored = await AsyncStorage.getItem('triggered_location');
      if (stored) {
        // Clear it after reading
        await AsyncStorage.removeItem('triggered_location');
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error('[LocationService] Error getting triggered location:', error);
      return null;
    }
  }

  /**
   * Clear triggered location
   */
  async clearTriggeredLocation(): Promise<void> {
    try {
      await AsyncStorage.removeItem('triggered_location');
    } catch (error) {
      console.error('[LocationService] Error clearing triggered location:', error);
    }
  }

  /**
   * Setup notification handler
   */
  async setupNotifications(): Promise<void> {
    try {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('[LocationService] Notification permissions denied');
        return;
      }

      // Configure notification behavior
      await Notifications.setNotificationChannelAsync('location-alerts', {
        name: 'Location Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
      });

      console.log('[LocationService] Notifications configured');
    } catch (error) {
      console.error('[LocationService] Error setting up notifications:', error);
    }
  }

  /**
   * Get distance to nearest location
   */
  async getDistanceToNearest(): Promise<{ location: LocationPoint; distance: number } | null> {
    try {
      const currentLocation = await this.getCurrentLocation();
      if (!currentLocation) {
        return null;
      }

      const { latitude, longitude } = currentLocation.coords;
      let nearest: { location: LocationPoint; distance: number } | null = null;

      for (const location of LOCATION_POINTS) {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude
        );

        if (!nearest || distance < nearest.distance) {
          nearest = { location, distance };
        }
      }

      return nearest;
    } catch (error) {
      console.error('[LocationService] Error getting distance to nearest:', error);
      return null;
    }
  }
}

// Export singleton instance
export const locationService = new LocationService();
