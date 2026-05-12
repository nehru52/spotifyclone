# 🏛️ Vatican Audio Guide App

Welcome to the **Vatican Audio Guide App**! This is a feature-rich, cross-platform mobile application designed to provide an immersive audio tour experience of Vatican City. With GPS-triggered audio playback, offline support, and interactive maps, explore the Vatican's treasures at your own pace.

## 📖 About

This app is built with React Native and Expo, offering a seamless audio guide experience for Vatican City visitors. Whether you're exploring St. Peter's Basilica, the Vatican Museums, or the beautiful Vatican Gardens, this app provides rich audio commentary and location-based features to enhance your visit.

## ✨ Features

- **GPS-Triggered Audio**: Automatically plays audio commentary when you reach specific locations
- **Multiple Tour Routes**: Choose from various curated tours (Quick Tour, Full Vatican Tour, Museums, Gardens)
- **Offline Mode**: Download tours for offline use
- **Interactive Maps**: See your location and navigate to points of interest
- **Multi-Language Support**: Available in multiple languages
- **Progress Tracking**: Resume tours where you left off
- **Favorites**: Save your favorite tours and locations
- **Rich Media**: High-quality audio with accompanying images and descriptions

## 🎯 Tour Categories

- **St. Peter's Basilica Tour** - Explore the magnificent basilica
- **Vatican Museums Highlights** - Discover masterpieces including the Sistine Chapel
- **Vatican Gardens Tour** - A peaceful walk through the gardens
- **Architecture & History** - Deep dive into Vatican's architectural wonders

# Cloning the project

Clone the project by running:

```bash
git clone https://github.com/dhunanyan/spotify-clone.git
cd spotify-clone
```

# How to install project dependencies?

Go to your terminal and run the following commands in the root of your project:

```bash
nvm use
yarn install
```

# Adding Your Audio Content

1. Place your audio files in `assets/audio/`
2. Place tour images in `assets/images/tours/`
3. Update tour data in `data/vatican-tours.ts` with your content

# How to run project?

To run project for iOS Device:

```bash
# if you have Apple Developer membership
yarn dev:ios

# if you DON'T have Apple Developer membership
yarn dev
```

To run project for Android Device:

```bash
yarn dev:android
```

# How to open the app on real device

If you're using a _real device_, go to `App Store (iOS)` / `Google Play (Android)` and install the `Expo Go` application.

After installing, open the camera on your phone and scan the QR code generated in the terminal.

# How to open the app on Native Simulator?

If using a Native Simulator, download and setup your simulator device.

Then in the terminal where you ran the app, press:

- `"a"` - for Android Simulator
- `"i"` - for iOS Simulator

## 📱 Key Features Explained

### GPS-Triggered Audio
The app uses your device's GPS to detect when you're near a point of interest and automatically plays the relevant audio commentary.

### Offline Support
Download tours before your visit to use the app without an internet connection.

### Progress Tracking
Your progress through each tour is automatically saved, so you can pause and resume at any time.

## 🛠️ Tech Stack

- React Native
- Expo
- TypeScript
- Expo Location (GPS)
- Expo AV (Audio Playback)
- React Navigation
- AsyncStorage (Offline Data)

## 📂 Project Structure

```
├── assets/
│   ├── audio/          # Audio guide files
│   ├── images/         # Tour images and icons
│   └── fonts/
├── data/
│   └── vatican-tours.ts # Tour data configuration
├── models/
│   └── Tour/           # TypeScript interfaces
├── services/
│   ├── TourService.ts       # Tour management
│   ├── AudioPlayerService.ts # Audio playback
│   └── LocationService.ts   # GPS tracking
├── screens/
│   ├── HomeScreen.tsx
│   ├── ToursScreen.tsx
│   ├── MapScreen.tsx
│   └── LibraryScreen.tsx
└── components/         # Reusable UI components

```

## 🎨 Customization

### Adding Your Tours

Edit `data/vatican-tours.ts` to add your tour data:

```typescript
{
  id: 'your-tour-id',
  name: 'Your Tour Name',
  description: 'Tour description',
  duration: 60, // minutes
  stops: [
    {
      id: 'stop-1',
      name: 'Stop Name',
      audioUrl: '/assets/audio/your-file.mp3',
      location: {
        latitude: 41.9029,
        longitude: 12.4534,
      },
      autoPlay: true,
      radius: 50, // meters
    }
  ]
}
```

### Changing Colors

Edit `config/colors.ts` to customize the app's color scheme.

### Changing Text

Edit `data/en-gb.ts` for English text, or create new language files.

## 📄 License

This project is licensed under the MIT License.
