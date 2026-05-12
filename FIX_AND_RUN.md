# 🔧 Fix Metro Cache & Run App

## The Issue
Metro bundler is caching old file references. We need to clear the cache.

## ✅ Solution (Choose One)

### Option 1: Clear Cache & Restart (Recommended)
```bash
# Stop the current server (Ctrl+C in terminal)
# Then run:
cd spotify-clone
yarn start --clear
# Wait for it to start, then press 'a' for Android
```

### Option 2: Delete Cache Manually
```bash
# Stop the server (Ctrl+C)
# Delete cache folders:
rm -rf node_modules/.cache
rm -rf .expo
# Restart:
yarn dev:android
```

### Option 3: Fresh Start
```bash
# Stop the server (Ctrl+C)
# Clean everything:
yarn install
# Start fresh:
yarn dev:android
```

## 📋 What's Ready

### ✅ Backend Services
- `src/services/content.ts` - Unified API
- `src/services/payload.ts` - Your Wonders of Rome backend
- `src/services/sanity.ts` - Alternative CMS
- `src/data/mock-tours.ts` - Test data (3 Vatican tours)

### ✅ Configuration
- `.env` - Set to mock mode (no backend needed)
- `app.config.js` - Audio plugin configured
- All types defined in `src/types/index.ts`

### ✅ Dependencies
- expo-audio ✅
- expo-sqlite ✅
- expo-task-manager ✅

## 🎯 After Cache Clear

The app will:
1. Build successfully
2. Show original Spotify UI
3. Backend services ready to integrate

## 📖 Integration Guide

### Fetch Your Vatican Tours
```typescript
import { fetchTours } from './src/services/content';

// In any component:
const tours = await fetchTours();
// Returns your Vatican tours from:
// - Mock data (if EXPO_PUBLIC_CONTENT_PROVIDER=mock)
// - Payload CMS (if EXPO_PUBLIC_CONTENT_PROVIDER=payload)
// - Sanity CMS (if EXPO_PUBLIC_CONTENT_PROVIDER=sanity)
```

### Switch to Your Real Backend
Edit `.env`:
```env
EXPO_PUBLIC_CONTENT_PROVIDER=payload
EXPO_PUBLIC_PAYLOAD_BASE_URL=https://wondersofrome.com
EXPO_PUBLIC_PAYLOAD_SIGHTS_COLLECTION=sights
EXPO_PUBLIC_PAYLOAD_TOURS_COLLECTION=tours
EXPO_PUBLIC_PAYLOAD_AUDIO_TOURS_COLLECTION=audio-tours
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://your-r2-bucket.r2.dev
```

## 🚀 Quick Commands

```bash
# Clear cache and start
yarn start --clear

# Run on Android
yarn dev:android

# Reload app (press in terminal)
r

# Open dev menu (press in terminal)
m
```

## ✅ Success Checklist

After clearing cache, you should see:
- [ ] "Bundling complete" message
- [ ] App opens on Android emulator
- [ ] Original Spotify UI visible
- [ ] No error messages

## 📚 Documentation

- **CURRENT_STATUS.md** - What's working now
- **BACKEND_SETUP.md** - Complete backend setup
- **SANITY_R2_INTEGRATION.md** - Technical details
- **START_HERE.md** - Getting started guide

## 🎉 You're Almost There!

Just clear the Metro cache and your app will run!

**Command**: `yarn start --clear` then press `a`
