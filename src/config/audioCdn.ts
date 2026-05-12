import Constants from 'expo-constants';

export const getAudioCdnBaseUrl = (): string | null => {
  const raw =
    Constants.expoConfig?.extra?.EXPO_PUBLIC_AUDIO_CDN_BASE_URL ??
    Constants.expoConfig?.extra?.EXPO_PUBLIC_CDN_BASE_URL ??
    '';

  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!trimmed) return null;
  return trimmed;
};
