import Constants from 'expo-constants';

export type PayloadConfig = {
  isConfigured: boolean;
  baseUrl: string;
  sightsCollection: string;
  toursCollection: string;
  audioToursCollection: string;
  productsCollection: string;
};

export const getPayloadConfig = (): PayloadConfig => {
  const baseUrl = (Constants.expoConfig?.extra?.EXPO_PUBLIC_PAYLOAD_BASE_URL ?? '').trim();
  
  return {
    isConfigured: !!baseUrl,
    baseUrl,
    sightsCollection: Constants.expoConfig?.extra?.EXPO_PUBLIC_PAYLOAD_SIGHTS_COLLECTION ?? 'sights',
    toursCollection: Constants.expoConfig?.extra?.EXPO_PUBLIC_PAYLOAD_TOURS_COLLECTION ?? 'tours',
    audioToursCollection: Constants.expoConfig?.extra?.EXPO_PUBLIC_PAYLOAD_AUDIO_TOURS_COLLECTION ?? 'audio-tours',
    productsCollection: Constants.expoConfig?.extra?.EXPO_PUBLIC_PAYLOAD_PRODUCTS_COLLECTION ?? 'products',
  };
};
