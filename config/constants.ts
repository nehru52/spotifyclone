export enum PLATFORMS {
  IOS = 'ios',
  ANDROID = 'android',
  WINDOWS = 'windows',
  MACOS = 'macos',
  WEB = 'web',
}

export enum Pages {
  HOME = 'home',
  MAP = 'map',
  BOOKING = 'booking',
  PROFILE = 'profile',
}

export enum Sizes {
  BIG = 152,
  MEDIUM = 140,
  SMALL = 120,
  VERY_SMALL = 100,
}

export enum Shapes {
  SQUARE = 0,
  SQUARE_BORDER = 4,
  SQUARE_BORDER_SMALL = 2,
  EDGED_BORDER = 8,
  OVAL = 20,
  CIRCLE = 9999,
}

export enum Categories {
  SAVED_TOURS = 'tour',
  AUDIO_STOPS = 'stop',
  DOWNLOADED = 'downloaded',
  FAVORITES = 'favorites',
  ALL = 'all',
}

export enum AuthResponse {
  CANCEL = 'cancel',
  DISMISS = 'dismiss',
  OPENED = 'opened',
  LOCKED = 'locked',
  ERROR = 'error',
  SUCCESS = 'success',
}

export enum AlbumTypes {
  ALBUM = 'album',
  SINGLE = 'single',
  COMPILATION = 'compilation',
}

export const SEPARATOR = '\u2022';
export const explicit_SIGN = 'E';

export const SOUND_COPYRIGHT_SIGN = '\u2117';
export const COPYRIGHT_SIGN = '\u00A9';

export const COMMON_HEADER_HEIGHT = 60;
export const HEADER_HEIGHT = 80;
export const HEADER_CATEGORIES_HEIGHT = 50;
export const BOTTOM_NAVIGATION_HEIGHT = 90;

export const COVER_SIZE = 300;
export const TRACK_COVER_SIZE = 50;
export const RECENTLY_PLAYED_COVER_SIZE = 55;
export const BROWSE_CATEGORY_IMAGE_SIZE = 75;
export const BROWSE_CATEGORY_HEIGHT = 55;

export const LANGS: { code: any; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'it', flag: '🇮🇹', label: 'IT' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'de', flag: '🇩🇪', label: 'DE' },
  { code: 'zh', flag: '🇨🇳', label: 'ZH' },
  { code: 'ja', flag: '🇯🇵', label: 'JA' },
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'pl', flag: '🇵🇱', label: 'PL' },
  { code: 'ru', flag: '🇷🇺', label: 'RU' },
  { code: 'ar', flag: '🇸🇦', label: 'AR' },
  { code: 'ko', flag: '🇰🇷', label: 'KO' },
];
