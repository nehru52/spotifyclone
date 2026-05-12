# 🚀 How to Run the Vatican Audio Guide App

## ✅ Current Status

- ✅ Android Emulator: **Running** (Pixel_7)
- ✅ Metro Server: **Running** on port 8080
- ✅ Sanity CMS: **Configured** and ready
- ✅ App: **Loading** on emulator

---

## 📱 Quick Start

### Your emulator and Metro server are already running!

The app should be loading on your Android emulator right now. If you see the Vatican test screen with tours from Sanity, everything is working!

---

## 🔄 If You Need to Restart

### 1. Check if Emulator is Running
```bash
adb devices
```

Should show:
```
emulator-5554   device
```

### 2. Start Metro Server (if not running)
```bash
cd "d:\spotify clone directory\spotify-clone"
yarn dev --clear
```

### 3. Open App on Emulator
Once Metro shows the QR code, press:
```
a
```

Or run:
```bash
adb shell am start -a android.intent.action.VIEW -d "exp://10.106.102.138:8080"
```

---

## 🐛 Troubleshooting

### Emulator Not Responding
```bash
# Restart emulator
adb reboot

# Or kill and restart
adb kill-server
adb start-server
```

### App Not Loading
```bash
# Clear Expo Go cache
adb shell pm clear host.exp.exponent

# Reload app
adb shell am start -a android.intent.action.VIEW -d "exp://10.106.102.138:8080"
```

### Metro Server Issues
```bash
# Stop Metro (Ctrl+C in terminal)
# Clear cache and restart
yarn dev --clear
```

---

## 📊 What You Should See

### On First Load:
1. **Loading screen** - "Loading Vatican Tours from SANITY..."
2. **Vatican test screen** with:
   - 🏛️ Vatican Audio Guide header
   - Tour cards with images from Sanity
   - System status showing:
     - Backend: SANITY
     - Tours Loaded: X
     - Status: ✅ Ready

### If You See Errors:
- Check Metro terminal for error messages
- Look for red error screen on emulator
- See troubleshooting section above

---

## 🎯 Expected Behavior

### ✅ Working:
- Fetching tours from Sanity CMS
- Displaying tour cards with images
- Showing tour details (title, description, duration)
- System status and debug info

### ⚠️ Not Yet Implemented:
- Audio playback (expo-audio removed temporarily)
- GPS features
- Booking integration
- User authentication

---

## 📝 Logs to Watch

In the Metro terminal, you should see:
```
LOG  [VaticanTest] Fetching tours from: sanity
LOG  [ContentService] Fetching tours from sanity
LOG  [Sanity] Fetching audio tours from Sanity CMS...
LOG  [Sanity] Fetched X audio tours
LOG  [ContentService] Fetched X tours from Sanity
LOG  [VaticanTest] Tours loaded: X
```

---

## 🔧 Common Commands

```bash
# Check emulator status
adb devices

# Reload app
adb shell am start -a android.intent.action.VIEW -d "exp://10.106.102.138:8080"

# Clear app cache
adb shell pm clear host.exp.exponent

# Restart emulator
adb reboot

# View emulator logs
adb logcat | grep -i expo
```

---

## 📞 Quick Reference

| Component | Status | Port/ID |
|-----------|--------|---------|
| Emulator | Running | emulator-5554 |
| Metro Server | Running | 8080 |
| Sanity CMS | Connected | aknmkkwd |
| Content Provider | Active | sanity |

---

## ✨ Next Steps

Once the app loads successfully:

1. **Verify Sanity Data** - Check if tours are displaying
2. **Test Navigation** - Browse through tour cards
3. **Check Images** - Verify images load from Sanity CDN
4. **Review Logs** - Confirm no errors in Metro terminal

---

**Your app is running! Check your Android emulator now! 🎉**
