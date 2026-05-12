/**
 * Support Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { COLORS } from '@config';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const SupportScreen = () => {
  const router = useRouter();

  const handleEmail = () => {
    const email = 'support@wondersofrome.com';
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Error', 'Could not open email app');
    });
  };

  const handleWhatsApp = () => {
    const phone = '+393123456789'; // Replace with actual number
    const message = 'Hello, I need help with the Wonders of Rome app';
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed on your device');
    });
  };

  const handleWebsite = () => {
    Linking.openURL('https://wondersofrome.com').catch(() => {
      Alert.alert('Error', 'Could not open website');
    });
  };

  const handleFAQ = () => {
    Alert.alert(
      'FAQ',
      'Frequently Asked Questions will be available soon. For now, please contact us directly.',
      [{ text: 'OK' }]
    );
  };

  const supportOptions = [
    {
      icon: 'mail',
      label: 'Email Support',
      description: 'support@wondersofrome.com',
      color: '#4CAF50',
      onPress: handleEmail,
    },
    {
      icon: 'logo-whatsapp',
      label: 'WhatsApp',
      description: 'Chat with us on WhatsApp',
      color: '#25D366',
      onPress: handleWhatsApp,
    },
    {
      icon: 'globe',
      label: 'Website',
      description: 'Visit our website',
      color: COLORS.VATICAN_BLUE,
      onPress: handleWebsite,
    },
    {
      icon: 'help-circle',
      label: 'FAQ',
      description: 'Frequently asked questions',
      color: '#FF9800',
      onPress: handleFAQ,
    },
  ];

  const quickHelp = [
    {
      question: 'How do I download tours?',
      answer: 'Tap the download button on any tour card on the Home screen. Downloads are available offline.',
    },
    {
      question: 'How does GPS Auto-Play work?',
      answer: 'Enable GPS in Settings → GPS Auto-Play. The app will automatically play audio when you\'re near a location.',
    },
    {
      question: 'Can I use the app offline?',
      answer: 'Yes! Download tours in advance and they\'ll be available without internet connection.',
    },
    {
      question: 'How do I change audio language?',
      answer: 'Use the language tabs at the top of the Home screen to select your preferred audio language.',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Ionicons name="headset" size={48} color={COLORS.VATICAN_GOLD} />
          <Text style={styles.heroTitle}>We're Here to Help</Text>
          <Text style={styles.heroText}>
            Get in touch with our support team for any questions or issues
          </Text>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          {supportOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionCard}
              onPress={option.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                <Ionicons name={option.icon as any} size={24} color={option.color} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(0,0,0,0.3)" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Help</Text>
          {quickHelp.map((item, index) => (
            <View key={index} style={styles.helpCard}>
              <View style={styles.helpHeader}>
                <Ionicons name="help-circle-outline" size={20} color={COLORS.VATICAN_GOLD} />
                <Text style={styles.helpQuestion}>{item.question}</Text>
              </View>
              <Text style={styles.helpAnswer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>App Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2024.01</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>iOS / Android</Text>
          </View>
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
  heroCard: {
    alignItems: 'center',
    margin: 16,
    padding: 32,
    backgroundColor: COLORS.VATICAN_GOLD + '10',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.VATICAN_GOLD + '30',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginTop: 16,
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
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
  helpCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  helpQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.BLACK,
    flex: 1,
  },
  helpAnswer: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 20,
    paddingLeft: 28,
  },
  infoSection: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.BLACK,
  },
  bottomSpacer: {
    height: 40,
  },
});
