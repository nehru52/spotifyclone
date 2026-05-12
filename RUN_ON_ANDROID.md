# 🤖 Run on Android Studio - Quick Guide

## Step 1: Configure Environment Variables

Your `.env` file needs your actual credentials. Update it with:

```env
# Get these from your Wonders of Rome app
EXPO_PUBLIC_SANITY_PROJECT_ID=your-actual-sanity-project-id
EXPO_PUBLIC_SANITY_DATASET=production
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://your-actual-r2-bucket.r2.dev
EXPO_PUBLIC_CONTENT_PROVIDER=sanity
```

**Where to find these:**
1. **Sanity Project ID**: Check your `wondersofrome_app/.env` file
2. **R2 Bucket URL**: Check your Cloudflare R2 dashboard

## Step 2: Install Dependencies

```bash
cd spotify-clone
yarn install
```

## Step 3: Start Development Server

```bash
yarn dev:android
```

This will:
1. Start the Expo dev server
2. Build the app
3. Launch Android Studio emulator
4. Install the app on the emulator

## Alternative: Run with Expo Dev Client

If you want more control:

```bash
# Start the dev server
yarn dev

# Then press 'a' to open Android
```

## Troubleshooting

### "Android Studio not found"
1. Make sure Android Studio is installed
2. Set ANDROID_HOME environment variable
3. Add Android SDK to PATH

### "No emulator found"
1. Open Android Studio
2. Go to Tools → Device Manager
3. Create a new virtual device
4. Start the emulator
5. Run `yarn dev:android` again

### "Dependencies not installed"
```bash
yarn install
```

### "Expo not found"
```bash
npm install -g expo-cli
```

## Quick Commands

```bash
# Install dependencies
yarn install

# Run on Android
yarn dev:android

# Run on Android (alternative)
yarn dev
# Then press 'a'

# Clear cache and run
yarn start --clear
```

## What You'll See

1. Terminal shows "Starting Metro Bundler..."
2. Android emulator launches
3. App installs automatically
4. App opens with Vatican Audio Guide

## First Run

The app will:
1. Fetch tours from Sanity CMS
2. Display them in Spotify-style UI
3. Allow you to browse and play audio

Enjoy! 🎉
