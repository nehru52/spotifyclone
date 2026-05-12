import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '@config';
import { Ionicons } from '@expo/vector-icons';
import { useUserData, useLanguage } from '@context';
import { useRouter } from 'expo-router';

export const ProfileScreen = () => {
  const { userData } = useUserData();
  const { translations } = useLanguage();
  const router = useRouter();

  const settingsOptions = [
    { icon: 'download-outline', label: translations.profile.downloads, route: '/downloads' },
    { icon: 'navigate-outline', label: translations.profile.gpsAutoPlay, route: '/gps-settings' },
    { icon: 'globe-outline', label: translations.profile.language, route: '/language' },
    { icon: 'help-circle-outline', label: translations.profile.support, route: '/support' },
    { icon: 'information-circle-outline', label: translations.profile.about, route: '/about' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userData.displayName?.charAt(0) || 'U'}</Text>
          </View>
          <View>
            <Text style={styles.name}>{userData.displayName || 'User'}</Text>
            <Text style={styles.email}>{userData.email || 'user@example.com'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>{translations.profile.editProfile}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{translations.profile.settings}</Text>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.option}
            onPress={() => {
              if (option.route) {
                router.push(option.route as any);
              }
            }}
          >
            <View style={styles.optionLeft}>
              <Ionicons name={option.icon as any} size={22} color={COLORS.BLACK} />
              <Text style={styles.optionLabel}>{option.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(0,0,0,0.3)" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutBtnText}>{translations.profile.logOut}</Text>
      </TouchableOpacity>

      <Text style={styles.version}>{translations.profile.version} 1.0.0 (Wonders of Rome)</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  header: {
    padding: 16,
    paddingTop: 5,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.BLACK,
    fontSize: 28,
    fontWeight: 'bold',
  },
  name: {
    color: COLORS.BLACK,
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 14,
    marginTop: 2,
  },
  editBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  editBtnText: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    color: COLORS.BLACK,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  option: {
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
    gap: 14,
  },
  optionLabel: {
    color: COLORS.BLACK,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutBtn: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,0,0,0.1)',
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
version: {
    color: 'rgba(0,0,0,0.2)',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
});
