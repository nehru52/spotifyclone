# Vatican Audio Guide - Setup Guide

This guide will help you integrate your audio files, images, and tour data into the Vatican Audio Guide app.

## 📁 Step 1: Organize Your Assets

### Audio Files
1. Create the audio directory structure:
   ```
   assets/
   └── audio/
       ├── st-peters/
       │   ├── stop-1.mp3
       │   ├── stop-2.mp3
       │   └── ...
       ├── museums/
       │   ├── sistine-chapel.mp3
       │   └── ...
       └── gardens/
           └── ...
   ```

2. Audio file requirements:
   - Format: MP3 or M4A (recommended)
   - Bitrate: 128kbps or higher
   - Sample rate: 44.1kHz
   - Mono or Stereo

### Images
1. Create the images directory structure:
   ```
   assets/
   └── images/
       ├── tours/
       │   ├── st-peters-cover.jpg
       │   ├── museums-cover.jpg
       │   └── gardens-cover.jpg
       ├── stops/
       │   ├── sistine-chapel.jpg
       │   └── ...
       └── logo.png (Vatican guide logo)
   ```

2. Image requirements:
   - Format: JPG or PNG
   - Tour covers: 1200x800px (3:2 ratio)
   - Stop images: 800x600px
   - Logo: 512x512px (PNG with transparency)

## 📝 Step 2: Configure Your Tour Data

Edit `data/vatican-tours.ts` with your actual tour information:

```typescript
export const VATICAN_TOURS: Tour[] = [
  {
    id: 'st-peters-basilica',
    name: 'St. Peter\'s Basilica Tour',
    description: 'Explore the magnificent St. Peter\'s Basilica...',
    duration: 45, // minutes
    coverImage: require('../assets/images/tours/st-peters-cover.jpg'),
    difficulty: 'easy',
    language: 'en',
    category: 'Religious Sites',
    featured: true,
    downloadable: true,
    stops: [
      {
        id: 'st-peters-square',
        tourId: 'st-peters-basilica',
        name: 'St. Peter\'s Square',
        description: 'Welcome to St. Peter\'s Square, designed by Bernini in the 17th century...',
        audioUrl: require('../assets/audio/st-peters/stop-1.mp3'),
        duration: 180, // seconds
        location: {
          latitude: 41.9022,
          longitude: 12.4539,
          address: 'Piazza San Pietro, Vatican City',
        },
        images: [
          require('../assets/images/stops/st-peters-square-1.jpg'),
          require('../assets/images/stops/st-peters-square-2.jpg'),
        ],
        order: 1,
        autoPlay: true, // GPS-triggered
        radius: 50, // meters - trigger radius
      },
      // Add more stops...
    ],
  },
  // Add more tours...
];
```

## 🗺️ Step 3: Get GPS Coordinates

For each audio stop, you need accurate GPS coordinates:

### Method 1: Google Maps
1. Go to [Google Maps](https://maps.google.com)
2. Right-click on the location
3. Click on the coordinates to copy them
4. Format: `latitude, longitude` (e.g., 41.9022, 12.4539)

### Method 2: On-Site Collection
1. Visit the location with your phone
2. Use a GPS app to record coordinates
3. Note the exact spot where audio should trigger

### Important GPS Settings:
- **radius**: Distance in meters from the point where audio triggers
  - Outdoor spaces: 30-50 meters
  - Indoor rooms: 10-20 meters
  - Large halls: 20-30 meters

## 🎨 Step 4: Customize Branding

### App Icon & Splash Screen
1. Replace `assets/images/logo.png` with your Vatican guide logo
2. Replace `assets/images/splash.png` with your splash screen
3. Run: `npx expo prebuild` to regenerate native projects

### Colors
Edit `config/colors.ts`:
```typescript
export const COLORS = {
  PRIMARY: '#1a1a2e',      // Main background
  TINT: '#ffd700',         // Accent color (buttons, highlights)
  VATICAN_GOLD: '#ffd700', // Vatican gold
  VATICAN_BLUE: '#003366', // Vatican blue
  // ... customize other colors
};
```

### Text & Labels
Edit `data/en-gb.ts` for English text:
```typescript
export const EN_GB = {
  welcomeTitle: 'Explore Vatican City \n Your Personal Audio Guide',
  // ... customize other text
};
```

## 🌍 Step 5: Add Multiple Languages

1. Create new language files:
   ```
   data/
   ├── en-gb.ts
   ├── it-it.ts  (Italian)
   ├── es-es.ts  (Spanish)
   ├── fr-fr.ts  (French)
   └── de-de.ts  (German)
   ```

2. Duplicate tour data for each language:
   ```
   data/
   ├── vatican-tours-en.ts
   ├── vatican-tours-it.ts
   └── ...
   ```

3. Update audio files with language-specific recordings

## 🧪 Step 6: Test Your Tours

### Testing GPS Triggers
1. **Simulator Testing** (without GPS):
   - Comment out `autoPlay: true` temporarily
   - Test manual playback of each stop
   - Verify audio files load correctly

2. **Real Device Testing** (with GPS):
   - Install Expo Go on your phone
   - Visit the actual locations
   - Test GPS-triggered playback
   - Adjust `radius` values if needed

### Testing Checklist:
- [ ] All audio files play correctly
- [ ] Images load for all tours and stops
- [ ] GPS triggers work at correct locations
- [ ] Progress tracking saves correctly
- [ ] Favorites can be added/removed
- [ ] Offline mode works (after download)
- [ ] App doesn't crash on low battery/background

## 📦 Step 7: Optimize for Production

### Audio Optimization
```bash
# Install ffmpeg (if not installed)
# Convert to optimized MP3
ffmpeg -i input.wav -codec:a libmp3lame -b:a 128k output.mp3
```

### Image Optimization
```bash
# Install imagemagick (if not installed)
# Resize and optimize images
convert input.jpg -resize 1200x800 -quality 85 output.jpg
```

### Bundle Size
- Keep total audio files under 100MB for initial download
- Offer individual tour downloads for offline use
- Compress images without losing quality

## 🚀 Step 8: Build for Production

### iOS Build
```bash
yarn build:bundle:ios
```

### Android Build
```bash
yarn build:bundle:android
```

## 📊 Tour Data Template

Here's a complete template for one tour:

```typescript
{
  id: 'unique-tour-id',
  name: 'Tour Name',
  description: 'Detailed tour description (2-3 sentences)',
  duration: 60, // Total duration in minutes
  coverImage: require('../assets/images/tours/cover.jpg'),
  difficulty: 'easy' | 'moderate' | 'challenging',
  language: 'en',
  category: 'Category Name',
  featured: true, // Show on home screen
  downloadable: true, // Allow offline download
  stops: [
    {
      id: 'unique-stop-id',
      tourId: 'unique-tour-id', // Must match tour id
      name: 'Stop Name',
      description: 'Stop description (1-2 sentences)',
      audioUrl: require('../assets/audio/file.mp3'),
      duration: 180, // Audio duration in seconds
      location: {
        latitude: 41.9022,
        longitude: 12.4539,
        address: 'Full address',
        floor: 'Ground Floor', // Optional
        room: 'Room 12', // Optional
      },
      images: [
        require('../assets/images/stops/image1.jpg'),
        require('../assets/images/stops/image2.jpg'),
      ],
      order: 1, // Stop sequence number
      autoPlay: true, // GPS-triggered
      radius: 50, // Trigger radius in meters
    },
  ],
}
```

## 🆘 Troubleshooting

### Audio Not Playing
- Check file format (MP3/M4A)
- Verify file path is correct
- Check device volume settings
- Test on real device (not simulator)

### GPS Not Triggering
- Ensure location permissions granted
- Check GPS coordinates are accurate
- Increase `radius` value
- Test outdoors (GPS works poorly indoors)

### Images Not Loading
- Verify image paths
- Check image file sizes (< 2MB each)
- Use `require()` for local images
- Test on both iOS and Android

## 📞 Need Help?

If you encounter issues:
1. Check the console for error messages
2. Verify all file paths are correct
3. Test on a real device (not just simulator)
4. Check that all required permissions are granted

## ✅ Pre-Launch Checklist

- [ ] All audio files added and tested
- [ ] All images optimized and added
- [ ] GPS coordinates verified on-site
- [ ] All tours have complete data
- [ ] Multiple languages configured (if applicable)
- [ ] App icon and splash screen updated
- [ ] Colors and branding customized
- [ ] Tested on both iOS and Android
- [ ] Offline mode tested
- [ ] GPS triggers tested at actual locations
- [ ] Battery usage optimized
- [ ] Privacy policy added (if collecting data)
