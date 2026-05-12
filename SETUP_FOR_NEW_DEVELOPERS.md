# 🚀 Setup Guide for New Developers

This guide will help you clone and run the Vatican Audio Guide app on your laptop.

## ⚠️ Important Notes

**This app will run with sample/mock data by default.** The real backend services (Sanity CMS, Cloudflare R2, Supabase) are NOT required to run the app and test it on an emulator or device.

## 📋 Prerequisites

Before you start, make sure you have these installed:

### 1. Node.js (v20 or higher)
- Download from: https://nodejs.org/
- Check version: `node --version`
- Should show v20.x.x or higher

### 2. Yarn Package Manager (v1.22.17 or higher)
- Install: `npm install -g yarn`
- Check version: `yarn --version`

### 3. Git
- Download from: https://git-scm.com/
- Check version: `git --version`

### 4. Code Editor (Optional but Recommended)
- VS Code: https://code.visualstudio.com/

### 5. For Android Emulator (Optional)
- Android Studio: https://developer.android.com/studio
- Set up Android emulator in Android Studio

### 6. For iOS Simulator (Mac Only)
- Xcode: Install from Mac App Store
- Xcode Command Line Tools: `xcode-select --install`

## 🔧 Step-by-Step Setup

### Step 1: Clone the Repository

Open your terminal/command prompt and run:

```bash
# Clone the repository
git clone https://github.com/nehru52/spotifyclone.git

# Navigate into the project folder
cd spotifyclone
```

### Step 2: Install Dependencies

```bash
# Install all required packages (this may take 5-10 minutes)
yarn install
```

**Note:** If you see any warnings about peer dependencies, you can ignore them.

### Step 3: Create Environment File (Optional)

The app works without this, but if you want to set it up properly:

```bash
# Copy the example environment file
cp .env.example .env
```

Then edit `.env` if you have backend credentials. **If you don't have them, skip this step - the app will use mock data.**

### Step 4: Start the Development Server

```bash
# Start Expo development server
yarn dev
```

Or if you want to specify a port:

```bash
# Start on port 8081
yarn dev:android
```

You should see:
- A QR code in the terminal
- A message saying "Metro waiting on exp://..."
- Options to press 'a' for Android, 'i' for iOS, 'w' for web

### Step 5: Run on Device or Emulator

#### Option A: Run on Your Phone (Easiest)

1. **Install Expo Go app:**
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. **Scan the QR code:**
   - iOS: Open Camera app and scan the QR code
   - Android: Open Expo Go app and scan the QR code

3. **Wait for the app to load** (first time may take 1-2 minutes)

#### Option B: Run on Android Emulator

1. **Start Android Studio**
2. **Open AVD Manager** (Android Virtual Device)
3. **Start an emulator**
4. **In the terminal where Expo is running, press `a`**

The app will automatically install and open on the emulator.

#### Option C: Run on iOS Simulator (Mac Only)

1. **Make sure Xcode is installed**
2. **In the terminal where Expo is running, press `i`**

The app will automatically open in the iOS Simulator.

#### Option D: Run in Web Browser

**In the terminal where Expo is running, press `w`**

The app will open in your default web browser (note: some features like GPS won't work in browser).

## ✅ Verify Everything Works

Once the app opens, you should see:

1. **Home Screen** with:
   - Vatican Tours branding
   - Sample tours (St. Peter's Basilica, Vatican Museums, etc.)
   - Navigation tabs at the bottom

2. **Test these features:**
   - Tap on a tour to see details
   - Play audio (sample audio will play)
   - Navigate between tabs (Home, Map, Booking, Profile)
   - Change language in settings

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find module" or "Module not found"

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
yarn install
yarn start --clear
```

### Issue 2: "Port 8081 already in use"

**Solution:**
```bash
# Kill the process using the port
# On Windows:
netstat -ano | findstr :8081
taskkill /PID <PID_NUMBER> /F

# On Mac/Linux:
lsof -ti:8081 | xargs kill -9

# Or use a different port:
yarn dev --port 8082
```

### Issue 3: Expo Go shows "Unable to connect"

**Solution:**
- Make sure your phone and laptop are on the **same WiFi network**
- Disable VPN if you're using one
- Try using tunnel mode: `yarn dev --tunnel`

### Issue 4: "Error: ENOSPC: System limit for number of file watchers reached"

**Solution (Linux only):**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Issue 5: Android emulator is slow

**Solution:**
- Allocate more RAM to the emulator in AVD Manager
- Enable hardware acceleration
- Or use a real device instead (much faster)

### Issue 6: "Bundler cache is empty, rebuilding"

**Solution:**
- This is normal on first run
- Wait 1-2 minutes for the bundle to build
- Subsequent runs will be faster

### Issue 7: ESLint running out of memory during commit

**Solution:**
- Skip the pre-commit hook: `git commit --no-verify`
- Or increase Node memory: `export NODE_OPTIONS="--max-old-space-size=4096"`

## 📱 Testing GPS Features

**Important:** GPS features only work on real devices, not emulators/simulators.

To test GPS features:
1. Run the app on your phone using Expo Go
2. Grant location permissions when prompted
3. Go to the Map screen
4. The app will show your current location
5. GPS-triggered audio will play when you're near a tour stop

**Note:** The sample data has GPS coordinates for Vatican City, so you won't trigger audio unless you're actually there. You can modify the coordinates in the code for testing.

## 🎨 Making Changes

### To modify tour data:
Edit: `data/vatican-tours.ts`

### To change colors:
Edit: `config/colors.ts`

### To change text/translations:
Edit: `data/en-gb.ts` (or other language files)

### To add new screens:
Add files in: `screens/` folder

After making changes, the app will automatically reload (Fast Refresh).

## 📦 Project Structure

```
spotifyclone/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based screens
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Landing page
├── assets/                # Images, fonts, audio files
├── components/            # Reusable UI components
├── config/                # App configuration
│   ├── colors.ts         # Color theme
│   └── constants.ts      # App constants
├── context/               # React Context providers
├── data/                  # Static data and translations
├── models/                # TypeScript types/interfaces
├── navigators/            # Navigation components
├── screens/               # Screen components
├── services/              # Business logic and API calls
├── src/                   # Additional source files
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## 🔄 Keeping Your Code Updated

To get the latest changes from the repository:

```bash
# Make sure you're in the project directory
cd spotifyclone

# Pull latest changes
git pull origin master

# Reinstall dependencies (if package.json changed)
yarn install

# Restart the dev server
yarn dev
```

## 🚀 Available Commands

```bash
# Start development server
yarn dev

# Start for Android
yarn dev:android

# Start for iOS (Mac only)
yarn dev:ios

# Start for web
yarn dev:web

# Run linter
yarn lint

# Format code
yarn prettier:write

# Clear cache and restart
yarn start --clear
```

## 📚 Additional Documentation

- **QUICK_START.md** - Quick 5-minute setup
- **README.md** - General project information
- **TOUR_DATA_TEMPLATE.md** - How to add tour data
- **ALL_FUNCTIONALITIES.md** - Complete feature list
- **ARCHITECTURE.md** - Technical architecture

## 🆘 Getting Help

If you run into issues:

1. **Check the error message** in the terminal
2. **Read the error carefully** - it usually tells you what's wrong
3. **Google the error** - many Expo/React Native errors are common
4. **Check Expo documentation**: https://docs.expo.dev/
5. **Ask the team** - share the error message and what you were doing

## ✨ You're All Set!

You should now have the Vatican Audio Guide app running on your device or emulator. 

**Next steps:**
1. Explore the app and test all features
2. Try making small changes to see how it works
3. Read the other documentation files to understand the codebase
4. Start contributing!

**Happy coding! 🏛️**
