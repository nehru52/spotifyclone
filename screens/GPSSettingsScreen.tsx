import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '@config';
import { Ionicons } from '@expo/vector-icons';
import { locationService, GPSSettings } from '../src/services/locationService';
import { useRouter } from 'expo-router';
import { useLanguage } from '@context';

export const GPSSettingsScreen = () => {
  const { translations } = useLanguage();
  const [settings, setSettings] = React.useState<GPSSettings | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [tracking, setTracking] = React.useState(false);
  const [nearestLocation, setNearestLocation] = React.useState<{
    name: string;
    distance: number;
  } | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    loadSettings();
    checkNearestLocation();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const currentSettings = await locationService.getSettings();
      setSettings(currentSettings);
      setTracking(currentSettings.enabled);
    } catch (error) {
      console.error('[GPSSettings] Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkNearestLocation = async () => {
    try {
      const nearest = await locationService.getDistanceToNearest();
      if (nearest) {
        setNearestLocation({
          name: nearest.location.name,
          distance: nearest.distance,
        });
      }
    } catch (error) {
      console.error('[GPSSettings] Error checking nearest location:', error);
    }
  };

  const handleToggleTracking = async (value: boolean) => {
    try {
      if (value) {
        // Request permissions first
        const hasPermission = await locationService.requestPermissions();
        if (!hasPermission) {
          Alert.alert(
            translations.gps.permissionRequired,
            translations.gps.permissionRequiredMsg,
            [{ text: translations.gps.ok }]
          );
          return;
        }

        // Enable tracking
        await locationService.updateSettings({ enabled: true });
        const started = await locationService.startTracking();
        
        if (started) {
          setTracking(true);
          Alert.alert(
            translations.gps.gpsEnabled,
            translations.gps.gpsEnabledMsg,
            [{ text: translations.gps.ok }]
          );
        } else {
          Alert.alert(translations.gps.error, translations.gps.errorMsg);
        }
      } else {
        // Disable tracking
        await locationService.updateSettings({ enabled: false });
        await locationService.stopTracking();
        setTracking(false);
      }

      await loadSettings();
    } catch (error) {
      console.error('[GPSSettings] Error toggling tracking:', error);
      Alert.alert(translations.gps.error, translations.gps.errorMsg);
    }
  };

  const handleToggleAutoPlay = async (value: boolean) => {
    try {
      await locationService.updateSettings({ autoPlayEnabled: value });
      await loadSettings();
    } catch (error) {
      console.error('[GPSSettings] Error toggling auto-play:', error);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    try {
      if (value) {
        await locationService.setupNotifications();
      }
      await locationService.updateSettings({ notificationsEnabled: value });
      await loadSettings();
    } catch (error) {
      console.error('[GPSSettings] Error toggling notifications:', error);
    }
  };

  const handleChangeRadius = (radius: number) => {
    Alert.alert(
      translations.gps.changeRadius,
      `${translations.gps.changeRadiusMsg} ${radius} ${translations.gps.meters}?`,
      [
        { text: translations.gps.cancel, style: 'cancel' },
        {
          text: translations.gps.confirm,
          onPress: async () => {
            await locationService.updateSettings({ radius });
            await loadSettings();
          },
        },
      ]
    );
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  if (loading || !settings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.VATICAN_GOLD} />
        <Text style={styles.loadingText}>{translations.gps.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.VATICAN_GOLD} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{translations.gps.title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons
              name={tracking ? 'location' : 'location-outline'}
              size={32}
              color={tracking ? '#4CAF50' : 'rgba(0,0,0,0.3)'}
            />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              {tracking ? translations.gps.gpsTrackingActive : translations.gps.gpsTrackingDisabled}
            </Text>
            <Text style={styles.statusSubtitle}>
              {tracking
                ? translations.gps.gpsActiveDesc
                : translations.gps.gpsInactiveDesc}
            </Text>
          </View>
        </View>

        {/* Nearest Location */}
        {nearestLocation && (
          <View style={styles.nearestCard}>
            <Ionicons name="navigate" size={24} color={COLORS.VATICAN_GOLD} />
            <View style={styles.nearestInfo}>
              <Text style={styles.nearestTitle}>{translations.gps.nearestLocation}</Text>
              <Text style={styles.nearestName}>
                {nearestLocation.name} • {formatDistance(nearestLocation.distance)} {translations.map.away}
              </Text>
            </View>
            <TouchableOpacity onPress={checkNearestLocation}>
              <Ionicons name="refresh" size={20} color={COLORS.VATICAN_GOLD} />
            </TouchableOpacity>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.VATICAN_GOLD} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>{translations.gps.howItWorks}</Text>
            <Text style={styles.infoText}>
              {translations.gps.howItWorksDesc.replace('range of a tour location', `${settings.radius}m ${translations.gps.howItWorksDesc.split('range of a tour location')[1]}`)}
            </Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.gps.settings}</Text>

          {/* Enable GPS Tracking */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="location" size={22} color={COLORS.BLACK} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{translations.gps.enableGpsTracking}</Text>
                <Text style={styles.settingDescription}>
                  {translations.gps.enableGpsTrackingDesc}
                </Text>
              </View>
            </View>
            <Switch
              value={tracking}
              onValueChange={handleToggleTracking}
              trackColor={{ false: '#ccc', true: COLORS.VATICAN_GOLD }}
              thumbColor={tracking ? COLORS.WHITE : '#f4f3f4'}
            />
          </View>

          {/* Auto-Play */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="play-circle" size={22} color={COLORS.BLACK} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{translations.gps.autoPlayAudio}</Text>
                <Text style={styles.settingDescription}>
                  {translations.gps.autoPlayAudioDesc}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoPlayEnabled}
              onValueChange={handleToggleAutoPlay}
              disabled={!tracking}
              trackColor={{ false: '#ccc', true: COLORS.VATICAN_GOLD }}
              thumbColor={settings.autoPlayEnabled ? COLORS.WHITE : '#f4f3f4'}
            />
          </View>

          {/* Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={22} color={COLORS.BLACK} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{translations.gps.locationNotifications}</Text>
                <Text style={styles.settingDescription}>
                  {translations.gps.locationNotificationsDesc}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={handleToggleNotifications}
              disabled={!tracking}
              trackColor={{ false: '#ccc', true: COLORS.VATICAN_GOLD }}
              thumbColor={settings.notificationsEnabled ? COLORS.WHITE : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Detection Radius */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.gps.detectionRadius}</Text>
          <Text style={styles.sectionSubtitle}>
            {translations.gps.detectionRadiusDesc}
          </Text>

          <View style={styles.radiusOptions}>
            {[25, 50, 100, 200].map((radius) => (
              <TouchableOpacity
                key={radius}
                style={[
                  styles.radiusOption,
                  settings.radius === radius && styles.radiusOptionActive,
                ]}
                onPress={() => handleChangeRadius(radius)}
                disabled={!tracking}
              >
                <Text
                  style={[
                    styles.radiusOptionText,
                    settings.radius === radius && styles.radiusOptionTextActive,
                  ]}
                >
                  {radius}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Battery Info */}
        <View style={styles.batteryCard}>
          <Ionicons name="battery-charging" size={24} color="#4CAF50" />
          <View style={styles.batteryInfo}>
            <Text style={styles.batteryTitle}>{translations.gps.batteryOptimized}</Text>
            <Text style={styles.batteryText}>
              {translations.gps.batteryOptimizedDesc}
            </Text>
          </View>
        </View>

        {/* Privacy Info */}
        <View style={styles.privacyCard}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.VATICAN_GOLD} />
          <View style={styles.privacyInfo}>
            <Text style={styles.privacyTitle}>{translations.gps.yourPrivacy}</Text>
            <Text style={styles.privacyText}>
              {translations.gps.yourPrivacyDesc}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.VATICAN_GOLD,
    fontSize: 14,
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: COLORS.NAV,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.VATICAN_GOLD,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.VATICAN_GOLD,
  },
  headerSpacer: {
    width: 40,
  },
  statusCard: {
    flexDirection: 'row',
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    gap: 16,
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 18,
  },
  nearestCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(212, 165, 116, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 165, 116, 0.3)',
    alignItems: 'center',
    gap: 12,
  },
  nearestInfo: {
    flex: 1,
  },
  nearestTitle: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 2,
  },
  nearestName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.BLACK,
  },
  infoCard: {
    flexDirection: 'row',
    margin: 20,
    marginTop: 0,
    padding: 16,
    backgroundColor: 'rgba(212, 165, 116, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 165, 116, 0.3)',
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.VATICAN_GOLD,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.7)',
    lineHeight: 18,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 4,
    marginTop: 16,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BLACK,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    lineHeight: 16,
  },
  radiusOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  radiusOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  radiusOptionActive: {
    backgroundColor: COLORS.VATICAN_GOLD,
    borderColor: COLORS.VATICAN_GOLD,
  },
  radiusOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BLACK,
  },
  radiusOptionTextActive: {
    color: COLORS.WHITE,
  },
  batteryCard: {
    flexDirection: 'row',
    margin: 20,
    marginTop: 0,
    padding: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    gap: 12,
  },
  batteryInfo: {
    flex: 1,
  },
  batteryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  batteryText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.7)',
    lineHeight: 18,
  },
  privacyCard: {
    flexDirection: 'row',
    margin: 20,
    marginTop: 0,
    marginBottom: 40,
    padding: 16,
    backgroundColor: 'rgba(212, 165, 116, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 165, 116, 0.3)',
    gap: 12,
  },
  privacyInfo: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.VATICAN_GOLD,
    marginBottom: 4,
  },
  privacyText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.7)',
    lineHeight: 18,
  },
});
