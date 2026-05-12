/**
 * About Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { COLORS } from '@config';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const AboutScreen = () => {
  const router = useRouter();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      console.error('Could not open URL:', url);
    });
  };

  const features = [
    {
      icon: 'headset',
      title: 'Audio Tours',
      description: '11 iconic locations with professional audio guides',
    },
    {
      icon: 'globe',
      title: '9 Languages',
      description: 'Tours available in multiple languages',
    },
    {
      icon: 'download',
      title: 'Offline Mode',
      description: 'Download tours and listen without internet',
    },
    {
      icon: 'navigate',
      title: 'GPS Auto-Play',
      description: 'Automatic playback when near locations',
    },
    {
      icon: 'map',
      title: 'Interactive Map',
      description: 'Explore locations on an interactive map',
    },
    {
      icon: 'time',
      title: 'Resume Playback',
      description: 'Continue where you left off',
    },
  ];

  const team = [
    { role: 'Founder & CEO', name: 'Marco Rossi' },
    { role: 'Lead Developer', name: 'Sofia Chen' },
    { role: 'Audio Producer', name: 'Giovanni Bianchi' },
    { role: 'Tour Guide Expert', name: 'Elena Marino' },
  ];

  const socialLinks = [
    { icon: 'logo-instagram', label: 'Instagram', url: 'https://instagram.com/wondersofrome' },
    { icon: 'logo-facebook', label: 'Facebook', url: 'https://facebook.com/wondersofrome' },
    { icon: 'logo-twitter', label: 'Twitter', url: 'https://twitter.com/wondersofrome' },
    { icon: 'logo-youtube', label: 'YouTube', url: 'https://youtube.com/wondersofrome' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Logo & Name */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="headset" size={64} color={COLORS.VATICAN_GOLD} />
          </View>
          <Text style={styles.appName}>Wonders of Rome</Text>
          <Text style={styles.tagline}>Your Personal Audio Tour Guide</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Mission */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            We believe that exploring Rome should be an enriching, personal experience. Our app brings the eternal city to life through expertly crafted audio tours, allowing you to discover Rome's wonders at your own pace.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon as any} size={24} color={COLORS.VATICAN_GOLD} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          {team.map((member, index) => (
            <View key={index} style={styles.teamCard}>
              <View style={styles.teamAvatar}>
                <Ionicons name="person" size={24} color={COLORS.VATICAN_GOLD} />
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamRole}>{member.role}</Text>
                <Text style={styles.teamName}>{member.name}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialContainer}>
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialBtn}
                onPress={() => openLink(social.url)}
                activeOpacity={0.7}
              >
                <Ionicons name={social.icon as any} size={28} color={COLORS.VATICAN_BLUE} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.legalLink}
            onPress={() => openLink('https://wondersofrome.com/privacy')}
          >
            <Text style={styles.legalText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(0,0,0,0.3)" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.legalLink}
            onPress={() => openLink('https://wondersofrome.com/terms')}
          >
            <Text style={styles.legalText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(0,0,0,0.3)" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.legalLink}
            onPress={() => openLink('https://wondersofrome.com/licenses')}
          >
            <Text style={styles.legalText}>Open Source Licenses</Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(0,0,0,0.3)" />
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            © 2024 Wonders of Rome
          </Text>
          <Text style={styles.copyrightText}>
            Made with ❤️ in Rome
          </Text>
        </View>

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
  logoSection: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 24,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.VATICAN_GOLD + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.4)',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 16,
  },
  missionText: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.7)',
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    padding: 16,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.VATICAN_GOLD + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 16,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginBottom: 8,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  teamAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.VATICAN_GOLD + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamInfo: {
    flex: 1,
  },
  teamRole: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 2,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BLACK,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  legalText: {
    fontSize: 15,
    color: COLORS.BLACK,
  },
  copyrightSection: {
    alignItems: 'center',
    padding: 24,
  },
  copyrightText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.4)',
    marginBottom: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});
