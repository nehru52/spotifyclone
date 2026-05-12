import Constants from 'expo-constants';

export type ContentProvider = 'sanity' | 'payload' | 'dual' | 'hybrid' | 'mock';

export const getContentProvider = (): ContentProvider => {
  const provider = Constants.expoConfig?.extra?.EXPO_PUBLIC_CONTENT_PROVIDER ?? 'sanity';
  if (['sanity', 'payload', 'dual', 'hybrid', 'mock'].includes(provider)) {
    return provider as ContentProvider;
  }
  return 'sanity';
};
