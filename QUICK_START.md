# Vatican Audio Guide - Quick Start

Get your Vatican Audio Guide app running in 5 minutes!

## 🚀 Quick Setup (5 Minutes)

### 1. Install Dependencies
```bash
cd spotify-clone
yarn install
```

### 2. Start the App
```bash
yarn dev
```

### 3. Open on Your Phone
- Install **Expo Go** from App Store (iOS) or Google Play (Android)
- Scan the QR code shown in your terminal
- App will open on your phone!

## 📱 What You'll See

The app is already functional with **sample data**:
- 3 example tours (St. Peter's, Museums, Gardens)
- Sample audio stops with placeholder data
- All features working (GPS, audio player, favorites)

## ✏️ Add Your Content (Next Steps)

### Step 1: Add Your Audio Files

Create the audio directory:
```bash
mkdir -p assets/audio/st-peters
mkdir -p assets/audio/museums
mkdir -p assets/audio/gardens
```

Copy your audio files:
```bash
# Example:
cp ~/your-audio-files/stop1.mp3 assets/audio/st-peters/01-square.mp3
cp ~/your-audio-files/stop2.mp3 assets/audio/st-peters/02-entrance.mp3
```

### Step 2: Add Your Images

Create the images directory:
```bash
mkdir -p assets/images/tours
mkdir -p assets/images/stops
```

Copy your images:
```bash
# Example:
cp ~/your-images/st-peters-cover.jpg assets/images/tours/
cp ~/your-images/square.jpg assets/images/stops/
```

### Step 3: Update Tour Data

Edit `data/vatican-tours.ts`:

```typescript
// Replace the sample data with your actual tours
export const VATICAN_TOURS: Tour[] = [
  {
    id: 'your-tour-id',
    name: 'Your Tour Name',
    description: 'Your tour description',
    duration: 45, // minutes
    coverImage: require('../assets/images/tours/your-cover.jpg'),
    difficulty: 'easy',
    language: 'en',
    category: 'Religious Sites',
    featured: true,
    downloadable: true,
    stops: [
      {
        id: 'your-stop-id',
        tourId: 'your-tour-id',
        name: 'Your Stop Name',
        description: 'Your stop description',
        audioUrl: require('../assets/audio/your-file.mp3'),
        duration: 180, // seconds
        location: {
          latitude: 41.9022,  // Your GPS coordinates
          longitude: 12.4539,
          address: 'Your address',
        },
        images: [require('../assets/images/stops/your-image.jpg')],
        order: 1,
        autoPlay: true,
        radius: 50, // meters
      },
      // Add more stops...
    ],
  },
  // Add more tours...
];
```

See `TOUR_DATA_TEMPLATE.md` for complete examples.

### Step 4: Test Your Changes

After adding your content:
```bash
# The app will automatically reload
# Test each tour and audio stop
```

## 🎨 Customize Branding

### Change Colors

Edit `config/colors.ts`:
```typescript
export const COLORS = {
  TINT: '#ffd700',         // Your accent color
  VATICAN_GOLD: '#ffd700', // Your gold color
  VATICAN_BLUE: '#003366', // Your blue color
  // ...
};
```

### Change Text

Edit `data/en-gb.ts`:
```typescript
export const EN_GB = {
  welcomeTitle: 'Your Custom Welcome Message',
  startButton: 'Your Button Text',
  // ...
};
```

### Change App Icon

Replace these files:
- `assets/images/logo.png` (512x512px)
- `assets/images/splash.png` (1242x2436px)

Then rebuild:
```bash
npx expo prebuild
```

## 🗺️ Get GPS Coordinates

### Quick Method (Google Maps):
1. Go to [maps.google.com](https://maps.google.com)
2. Right-click on your location
3. Click the coordinates to copy
4. Use in your tour data: `latitude: 41.9022, longitude: 12.4539`

### On-Site Method:
1. Visit the location with your phone
2. Open Google Maps
3. Long-press on your current location
4. Coordinates appear at the top - tap to copy

## 📋 File Structure Overview

```
spotify-clone/
├── assets/
│   ├── audio/          ← Put your audio files here
│   │   ├── st-peters/
│   │   ├── museums/
│   │   └── gardens/
│   └── images/         ← Put your images here
│       ├── tours/
│       └── stops/
├── data/
│   └── vatican-tours.ts ← Edit your tour data here
├── config/
│   ├── colors.ts       ← Customize colors here
│   └── constants.ts
├── services/           ← Core functionality (don't edit)
├── components/         ← UI components (don't edit)
└── screens/            ← App screens (don't edit)
```

## ✅ Testing Checklist

### Basic Testing (Simulator/Expo Go)
- [ ] App launches without errors
- [ ] Tours appear on home screen
- [ ] Can navigate to tour details
- [ ] Audio files play correctly
- [ ] Images load properly
- [ ] Can add/remove favorites

### GPS Testing (Real Device Only)
- [ ] Location permission requested
- [ ] Can start GPS tracking
- [ ] Audio plays when near location
- [ ] Distance calculations work
- [ ] Can stop GPS tracking

## 🐛 Common Issues

### "Cannot find module" error
```bash
# Clear cache and reinstall
rm -rf node_modules
yarn install
yarn start --clear
```

### Audio not playing
- Check file path in `vatican-tours.ts`
- Verify audio file exists
- Test on real device (not simulator)
- Check audio format (MP3 or M4A)

### Images not loading
- Use `require()` not string paths
- Check file path is correct
- Verify image exists in assets folder

### GPS not working
- Test on real device (not simulator)
- Grant location permissions
- Test outdoors (GPS works poorly indoors)
- Increase `radius` value

## 📚 Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **TOUR_DATA_TEMPLATE.md** - Tour data examples
- **TRANSFORMATION_SUMMARY.md** - What was changed
- **README.md** - General app information

## 🎯 Next Steps

1. ✅ **You are here** - App is running with sample data
2. 📁 Add your audio files and images
3. ✏️ Update tour data with your content
4. 🧪 Test on real device at actual locations
5. 🎨 Customize colors and branding
6. 🌍 Add more languages (optional)
7. 📦 Build for production
8. 🚀 Publish to app stores

## 💡 Pro Tips

1. **Start small** - Add one complete tour first, then expand
2. **Test early** - Visit locations and test GPS triggers
3. **Optimize files** - Compress audio and images to reduce app size
4. **Get feedback** - Test with real users at Vatican
5. **Iterate** - Adjust trigger radius based on real-world testing

## 🆘 Need Help?

1. Check the console for error messages
2. Read the detailed guides (SETUP_GUIDE.md, etc.)
3. Verify file paths are correct
4. Test on real device for GPS features
5. Check that all required files exist

## 🎉 You're Ready!

Your Vatican Audio Guide app is now running. Start by:
1. Exploring the sample tours
2. Adding your first audio file
3. Testing the audio playback
4. Gradually replacing sample data with your content

**Happy building! 🏛️**
