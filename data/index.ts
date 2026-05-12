import { EN_GB } from './en-gb';
import { IT } from './it';
import { ES } from './es';
import { FR } from './fr';
import { DE } from './de';
import { PT } from './pt';
import { ZH } from './zh';
import { JA } from './ja';
import { AR } from './ar';

export const TRANSLATIONS = {
  en: EN_GB,
  it: IT,
  es: ES,
  fr: FR,
  de: DE,
  pt: PT,
  zh: ZH,
  ja: JA,
  ar: AR,
};

// Default to English
export const translations = { ...EN_GB };

// Function to get translations for a specific language
export const getTranslations = (languageCode: string) => {
  return TRANSLATIONS[languageCode as keyof typeof TRANSLATIONS] || EN_GB;
};
