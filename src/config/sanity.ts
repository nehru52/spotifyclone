import Constants from 'expo-constants';

export const SANITY_PROJECT_ID = Constants.expoConfig?.extra?.EXPO_PUBLIC_SANITY_PROJECT_ID ?? '';
export const SANITY_DATASET = Constants.expoConfig?.extra?.EXPO_PUBLIC_SANITY_DATASET ?? 'production';
export const SANITY_API_TOKEN = Constants.expoConfig?.extra?.EXPO_PUBLIC_SANITY_API_TOKEN ?? '';
export const SANITY_API_VERSION = '2024-01-01';

export const getSanityImageUrl = (ref: string, width = 800): string => {
  // ref format: image-<id>-<dimensions>-<format>
  const parts = ref.replace('image-', '').split('-');
  const format = parts.pop();
  const id = parts.join('-');
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}.${format}?w=${width}&auto=format`;
};
