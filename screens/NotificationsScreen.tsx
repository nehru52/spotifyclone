/**
 * Notifications Settings Screen
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '@config';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'notification_settings';

interface NotificationSettings {
  pushEnabled: boolean;
  locationAlerts: boolean;
  downloadComplete: boolean;
  tourReminders: boolean;
  promotions: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export const NotificationsScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    locationAlerts: true,
    downloadComplete: true,
    tourReminders: true,
    promotions: false,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('[NotificationsScreen] Error loading settings:', error);
    }
  };

  const updateSetting = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('[NotificationsScreen] Error updating setting:', error);
      Alert.alert('Error', 'Could not save settings. Please try again.');
    }
  };

  const notificationOptions = [
    {
      key: 'pushEnabled' as keyof NotificationSettings,
      icon: 'notifications',
      label: 'Push Notifications',
      description: 'Enable all push notifications',
      color: COLORS.VATICAN_GOLD,
    },
    {
      key: 'locationAlerts' as keyof NotificationSettings,
      icon: 'location',
      label: 'Location Alerts',
      description: 'Get notified when near tour locations',
      color: '#4CAF50',
    },
    {
      key: 'downloadComplete' as keyof NotificationSettings,
      icon: 'download',
      label: 'Download Complete',
      description: 'Notify when tour downloads finish',
      color: '#2196F3',
    },
    {
      key: 'tourReminders' as keyof NotificationSettings,
      icon: 'time',
      label: 'Tour Reminders',
      description: 'Reminders for scheduled tours',
      color: '#FF9800',
    },
    {
      key: 'promotions' as keyof NotificationSettings,
      icon: 'pricetag',
      label: 'Promotions & Offers',
      description: 'Special deals and new tours',
      color: '#E91E63',
    },
  ];

  const soundOptions = [
    {
      key: 'soundEnabled' as keyof NotificationSettings,
      icon: 'volume-high',
      label: 'Sound',
      description: 'Play sound for notifications',
    },
    {
      key: 'vibrationEnabled' as keyof NotificationSettings,
      icon: 'phone-portrait',
      label: 'Vibration',
      description: 'Vibrate for notifications',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.VATICAN_GOLD} />
          <Text style={styles.infoText}>
            Manage your notification preferences to stay updated about tours, downloads, and location alerts.
          </Text>
        </View>

        {/* Notification Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          {notificationOptions.map((option) => (
            <View key={option.key} style={styles.optionCard}>
              <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                <Ionicons name={option.icon as any} size={24} color={option.color} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Switch
                value={settings[option.key]}
                onValueChange={(value) => updateSetting(option.key, value)}
                trackColor={{ false: '#767577', true: option.color }}
                thumbColor={settings[option.key] ? COLORS.WHITE : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        {/* Sound & Vibration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound & Vibration</Text>
          {soundOptions.map((option) => (
            <View key={option.key} style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name={option.icon as any} size={22} color={COLORS.BLACK} />
                <View>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </View>
              <Switch
                value={settings[option.key]}
                onValueChange={(value) => updateSetting(option.key, value)}
                trackColor={{ false: '#767577', true: COLORS.VATICAN_GOLD }}
                thumbColor={settings[option.key] ? COLORS.WHITE : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        {/* Test Notification */}
        <TouchableOpacity
          style={styles.testBtn}
          onPress={() => {
            Alert.alert(
              '🔔 Test Notification',
              'This is how notifications will appear on your device!',
              [{ text: 'OK' }]
            );
          }}
        >
          <Ionicons name="notifications-outline" size={20} color={COLORS.WHITE} />
          <Text style={styles.testBtnText}>Send Test Notification</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.PRIMARY,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.VATICAN_GOLD + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.VATICAN_GOLD + '30',
  },
  infoText: {
    flex: 1,
    color: COLORS.BLACK,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BLACK,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.5)',
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.VATICAN_BLUE,
    borderRadius: 12,
  },
  testBtnText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
