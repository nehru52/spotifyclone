# 🚀 Quick .env Guide for Your Cousin

## ⚡ TL;DR

**Your cousin needs ONLY ONE environment variable to make audio work:**

```bash
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio
```

That's it! Everything else is optional.

---

## 📝 Step-by-Step Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/nehru52/spotifyclone.git
cd spotifyclone
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Create .env File (Optional but Recommended)

**On Windows:**
```bash
notepad .env
```

**On Mac/Linux:**
```bash
nano .env
```

**Paste this ONE line:**
```
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio
```

Save and close.

### 4. Start the App
```bash
yarn start --clear
```

### 5. Open on Phone
- Install **Expo Go** app
- Scan the QR code
- Done! 🎉

---

## ❓ Do I Need the CDN URL?

### Without CDN URL (No .env):
- ✅ App runs perfectly
- ✅ All UI works
- ✅ Navigation works
- ✅ GPS works
- ❌ **Audio won't play**

### With CDN URL (Minimal .env):
- ✅ Everything above
- ✅ **Audio plays!** 🎵
- ✅ Can download tours
- ✅ Full app experience

---

## 🔐 Is the CDN URL Secret?

**NO!** The CDN URL is public. Anyone can use it. No authentication needed.

It's safe to share:
```
https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio
```

---

## 🎯 What About Other Environment Variables?

**All optional!** The app has fallbacks for everything:

| Variable | Needed For | Without It |
|----------|-----------|------------|
| `AUDIO_CDN_BASE_URL` | Audio playback | Audio won't play |
| `SANITY_PROJECT_ID` | Real tour data | Uses mock data |
| `PAYLOAD_BASE_URL` | Booking system | Opens website |
| `MAPBOX_TOKEN` | Interactive maps | Uses basic map |

**For testing, only the audio CDN URL matters.**

---

## 🆘 Troubleshooting

### Audio not playing?

1. **Check .env file exists:**
   ```bash
   cat .env
   ```
   Should show the CDN URL.

2. **Restart with clear cache:**
   ```bash
   yarn start --clear
   ```

3. **Check internet connection** - Audio streams from CDN

4. **Test CDN directly** - Open in browser:
   ```
   https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio/en/colosseum/deep/playlist.m3u8
   ```

---

## 📧 Share This With Your Cousin

**"Hey! To run the app with audio:**

1. **Clone the repo**
2. **Run `yarn install`**
3. **Create a file called `.env` with this line:**
   ```
   EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio
   ```
4. **Run `yarn start --clear`**
5. **Scan QR code with Expo Go**

**That's all you need! The app will work with full audio.** 🎵"

---

## ✅ Summary

- **Required:** Nothing! App works without .env
- **Recommended:** Just the CDN URL for audio
- **Optional:** All other credentials

**The CDN URL is public and safe to share!** 🚀

---

For more details, see `ENV_REQUIREMENTS.md`
