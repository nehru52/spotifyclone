# 👋 Welcome New Developer!

## Quick Start Checklist

Follow these steps to get the app running on your laptop:

### ✅ Step 1: Install Prerequisites (15 minutes)

- [ ] Install **Node.js v20+** from https://nodejs.org/
- [ ] Install **Yarn**: Open terminal and run `npm install -g yarn`
- [ ] Install **Git** from https://git-scm.com/
- [ ] (Optional) Install **VS Code** from https://code.visualstudio.com/

**Verify installations:**
```bash
node --version    # Should show v20.x.x or higher
yarn --version    # Should show 1.22.x or higher
git --version     # Should show any version
```

### ✅ Step 2: Clone the Repository (2 minutes)

```bash
# Clone the project
git clone https://github.com/nehru52/spotifyclone.git

# Go into the folder
cd spotifyclone
```

### ✅ Step 3: Install Dependencies (5-10 minutes)

```bash
# This will download all required packages
yarn install
```

**Note:** This may take several minutes. Be patient!

### ✅ Step 4: Start the App (1 minute)

```bash
# Start the development server
yarn dev
```

You should see a QR code appear in your terminal!

### ✅ Step 5: Open on Your Phone (2 minutes)

**On your phone:**
1. Download **Expo Go** app:
   - iOS: App Store
   - Android: Google Play Store

2. Open Expo Go and scan the QR code from your terminal

3. Wait for the app to load (first time takes 1-2 minutes)

**That's it! The app should now be running on your phone! 🎉**

---

## 🎯 What You Should See

When the app opens, you'll see:
- **Home screen** with Vatican Tours
- **Sample tours** (St. Peter's Basilica, Vatican Museums, etc.)
- **Bottom navigation** (Home, Map, Booking, Profile)

### Test These Features:
- ✅ Tap on a tour to see details
- ✅ Play audio samples
- ✅ Navigate between tabs
- ✅ Go to Profile → Language to change language
- ✅ Try the Map screen

---

## 🚨 Troubleshooting

### Problem: "Cannot connect to Metro"
**Solution:** Make sure your phone and laptop are on the **same WiFi network**

### Problem: "Port 8081 already in use"
**Solution:** 
```bash
# Use a different port
yarn dev --port 8082
```

### Problem: "Module not found"
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
yarn install
yarn start --clear
```

### Problem: App won't load on phone
**Solution:**
- Check WiFi connection
- Try tunnel mode: `yarn dev --tunnel`
- Restart the dev server (Ctrl+C, then `yarn dev` again)

---

## 📱 Alternative: Run on Emulator

### Android Emulator:
1. Install Android Studio
2. Set up an Android Virtual Device (AVD)
3. Start the emulator
4. In terminal, press `a`

### iOS Simulator (Mac only):
1. Install Xcode from App Store
2. In terminal, press `i`

---

## 📖 Next Steps

Once the app is running:

1. **Read the documentation:**
   - `SETUP_FOR_NEW_DEVELOPERS.md` - Detailed setup guide
   - `QUICK_START.md` - Quick reference
   - `README.md` - Project overview

2. **Explore the code:**
   - `app/` - App screens
   - `components/` - UI components
   - `data/` - Tour data and translations
   - `config/colors.ts` - Color theme

3. **Make a small change:**
   - Try changing a color in `config/colors.ts`
   - The app will automatically reload!

---

## 🆘 Need Help?

1. Check the error message in the terminal
2. Read `SETUP_FOR_NEW_DEVELOPERS.md` for detailed troubleshooting
3. Google the error (many are common)
4. Ask the team!

---

## 📋 Important Notes

- **The app works with mock/sample data** - no backend setup required
- **GPS features only work on real devices**, not emulators
- **First load takes 1-2 minutes** - subsequent loads are faster
- **Changes auto-reload** - no need to restart the app

---

## ✨ You're Ready!

If you can see the Vatican Tours app on your phone, you're all set! 

**Happy coding! 🏛️**

---

## 📞 Quick Commands Reference

```bash
# Start development server
yarn dev

# Start with clear cache
yarn start --clear

# Run on Android emulator
yarn dev:android

# Run on iOS simulator (Mac only)
yarn dev:ios

# Check for errors
yarn lint

# Pull latest changes
git pull origin master
```
