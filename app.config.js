module.exports = {
  expo: {
    name: 'Vatican Audio Guide',
    slug: 'vatican-audio-guide',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/logo.png',
    scheme: 'vatican-guide',
    plugins: ['expo-router', 'expo-asset'],
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#FDF5E6',
    },
    android: {
      package: 'com.wondersofrome.vaticanaudiotour',
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'ACCESS_BACKGROUND_LOCATION',
        'FOREGROUND_SERVICE',
        'FOREGROUND_SERVICE_LOCATION',
        'POST_NOTIFICATIONS'
      ],
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        },
      },
    },
    ios: {
      bundleIdentifier: 'com.wondersofrome.vaticanaudiotour',
      infoPlist: {
        NSLocationWhenInUseUsageDescription: 'This app needs your location to automatically play audio tours when you arrive at historical sites.',
        NSLocationAlwaysAndWhenInUseUsageDescription: 'This app needs your location in the background to automatically play audio tours when you arrive at historical sites.',
        NSLocationAlwaysUsageDescription: 'This app needs your location in the background to automatically play audio tours when you arrive at historical sites.',
        UIBackgroundModes: ['location', 'audio']
      },
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      },
    },
    web: {
      bundler: 'metro',
      favicon: './assets/images/logo.png',
    },
    experiments: {
      typedRoutes: true,
    },
    updates: {
      enabled: false,
      checkAutomatically: 'ON_ERROR_RECOVERY',
      fallbackToCacheTimeout: 0,
    },
    extra: {
      // Content Provider
      EXPO_PUBLIC_CONTENT_PROVIDER: process.env.EXPO_PUBLIC_CONTENT_PROVIDER || 'sanity',
      
      // Sanity CMS (Tour Content)
      EXPO_PUBLIC_SANITY_PROJECT_ID: process.env.EXPO_PUBLIC_SANITY_PROJECT_ID,
      EXPO_PUBLIC_SANITY_DATASET: process.env.EXPO_PUBLIC_SANITY_DATASET || 'production',
      EXPO_PUBLIC_SANITY_API_TOKEN: process.env.EXPO_PUBLIC_SANITY_API_TOKEN,
      
      // Payload CMS (Bookings & Tickets)
      EXPO_PUBLIC_PAYLOAD_BASE_URL: process.env.EXPO_PUBLIC_PAYLOAD_BASE_URL,
      EXPO_PUBLIC_PAYLOAD_API_KEY: process.env.EXPO_PUBLIC_PAYLOAD_API_KEY,
      EXPO_PUBLIC_PAYLOAD_BOOKINGS_COLLECTION: process.env.EXPO_PUBLIC_PAYLOAD_BOOKINGS_COLLECTION || 'bookings',
      EXPO_PUBLIC_PAYLOAD_TICKETS_COLLECTION: process.env.EXPO_PUBLIC_PAYLOAD_TICKETS_COLLECTION || 'tickets',
      
      // Cloudflare R2 CDN (Audio Files)
      EXPO_PUBLIC_AUDIO_CDN_BASE_URL: process.env.EXPO_PUBLIC_AUDIO_CDN_BASE_URL,
      
      // Supabase (User Auth)
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      
      // Website Integration
      EXPO_PUBLIC_WEBSITE_URL: process.env.EXPO_PUBLIC_WEBSITE_URL || 'https://wondersofrome.com',
      EXPO_PUBLIC_BOOKING_URL: process.env.EXPO_PUBLIC_BOOKING_URL || 'https://wondersofrome.com/book',
      
      // Contact Info
      EXPO_PUBLIC_CONTACT_EMAIL: process.env.EXPO_PUBLIC_CONTACT_EMAIL,
      EXPO_PUBLIC_WHATSAPP_NUMBER: process.env.EXPO_PUBLIC_WHATSAPP_NUMBER,
      
      // Mapbox
      EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
      
      router: {
        origin: false,
      },
      eas: {
        projectId: '33b0281a-b127-47fe-ab16-e94caf272493',
      },
    },
  },
};
