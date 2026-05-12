/**
 * Language Settings Screen
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '@config';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLanguage } from '@context';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

export const LanguageScreen = () => {
  const router = useRouter();
  const { language: currentLanguage, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const selectLanguage = async (code: string) => {
    try {
      setSelectedLanguage(code);
      await setLanguage(code);
      
      Alert.alert(
        'Language Changed',
        'The app language has been updated. The entire app interface and default audio language will now use ' + LANGUAGES.find(l => l.code === code)?.name + '. Please restart the app for all changes to take effect.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('[LanguageScreen] Error saving language:', error);
      Alert.alert('Error', 'Could not save language preference. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="globe" size={24} color={COLORS.VATICAN_GOLD} />
          <Text style={styles.infoText}>
            Choose your preferred language. This will change the entire app interface and set the default audio tour language.
          </Text>
        </View>

        {/* Language List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Languages</Text>
          {LANGUAGES.map((language) => {
            const isSelected = selectedLanguage === language.code;
            return (
              <TouchableOpacity
                key={language.code}
                style={[styles.languageCard, isSelected && styles.languageCardSelected]}
                onPress={() => selectLanguage(language.code)}
                activeOpacity={0.7}
              >
                <View style={styles.languageLeft}>
                  <Text style={styles.flag}>{language.flag}</Text>
                  <View style={styles.languageInfo}>
                    <Text style={[styles.languageName, isSelected && styles.languageNameSelected]}>
                      {language.name}
                    </Text>
                    <Text style={[styles.nativeName, isSelected && styles.nativeNameSelected]}>
                      {language.nativeName}
                    </Text>
                  </View>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.VATICAN_GOLD} />
                )}
              </TouchableOpacity>
            );
          })}
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
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  languageCardSelected: {
    borderColor: COLORS.VATICAN_GOLD,
    borderWidth: 2,
    backgroundColor: COLORS.VATICAN_GOLD + '10',
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  flag: {
    fontSize: 32,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BLACK,
    marginBottom: 2,
  },
  languageNameSelected: {
    color: COLORS.VATICAN_GOLD,
    fontWeight: 'bold',
  },
  nativeName: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.5)',
  },
  nativeNameSelected: {
    color: COLORS.VATICAN_GOLD,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
  },
  noteText: {
    flex: 1,
    color: 'rgba(0,0,0,0.6)',
    fontSize: 13,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 40,
  },
});
