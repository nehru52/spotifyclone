# 🔐 Environment Variables - What Your Cousin Needs

## ⚡ Quick Answer

**Your cousin needs ZERO environment variables to run the app!**

The app will work perfectly fine without any `.env` file. Here's why:

---

## 🎯 Three Ways to Run the App

### Option 1: No .env File (Easiest) ✅ RECOMMENDED

```bash
# Just run the app - no .env needed!
yarn install
yarn dev
```

**What works:**
- ✅ All UI and navigation
- ✅ Tour listings (uses mock data)
- ✅ Language switching
- ✅ Map interface
- ✅ GPS tracking
- ✅ All screens and features
- ❌ Audio won't play (no CDN URL)
- ❌ Booking won't work (no backend)

**Perfect for:** Testing UI, navigation, and general app flow

---

### Option 2: Minimal .env (Audio Only) ✅ BEST FOR TESTING

Create `.env` file with just ONE line:

```bash
# .env file - ONLY THIS ONE LINE NEEDED!
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio
```

**What works:**
- ✅ Everything from Option 1
- ✅ **Audio playback** (streams from CDN)
- ✅ **Download tours** for offline
- ❌ Booking still won't work (no backend credentials)

**Perfect for:** Full app testing with working audio

---

### Option 3: Full .env (All Features) 🔒 REQUIRES CREDENTIALS

Copy your `.env` file to your cousin:

```bash
# Copy the entire .env file
cp .env .env.backup
# Send .env.backup to your cousin
```

**What works:**
- ✅ Everything!
- ✅ Audio playback
- ✅ Booking system
- ✅ Sanity CMS data
- ✅ All backend features

**Perfect for:** Production testing, full feature access

---

## 📋 Environment Variables Breakdown

### 🎵 **AUDIO (Most Important)**

```bash
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio
```

**Required for:** Audio playback  
**Without it:** Audio won't play, but app still works  
**Fallback:** App uses empty string, audio fails silently

---

### 🏛️ **SANITY CMS (Tour Content)**

```bash
EXPO_PUBLIC_SANITY_PROJECT_ID=your_project_id
EXPO_PUBLIC_SANITY_DATASET=production
EXPO_PUBLIC_SANITY_API_TOKEN=your_api_token_here
```

**Required for:** Loading tour data from Sanity CMS  
**Without it:** App uses mock/fallback data  
**Fallback:** App has hardcoded Vatican tours

---

### 🎫 **PAYLOAD CMS (Bookings)**

```bash
EXPO_PUBLIC_PAYLOAD_BASE_URL=https://your-admin-url.com
EXPO_PUBLIC_PAYLOAD_API_KEY=your_api_key_here
EXPO_PUBLIC_PAYLOAD_BOOKINGS_COLLECTION=bookings
EXPO_PUBLIC_PAYLOAD_TICKETS_COLLECTION=tickets
```

**Required for:** Booking tours and tickets  
**Without it:** Booking screen shows placeholder  
**Fallback:** Booking button opens website URL

---

### 🗺️ **MAPBOX (Maps)**

```bash
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token_here
```

**Required for:** Interactive maps  
**Without it:** Map shows basic view  
**Fallback:** Uses default map tiles

---

### 🌐 **WEBSITE & CONTACT (Optional)**

```bash
EXPO_PUBLIC_WEBSITE_URL=https://wondersofrome.com
EXPO_PUBLIC_BOOKING_URL=https://wondersofrome.com/book
EXPO_PUBLIC_CONTACT_EMAIL=info@wondersofrome.com
EXPO_PUBLIC_WHATSAPP_NUMBER=3514199425
```

**Required for:** External links and contact info  
**Without it:** Uses default URLs  
**Fallback:** Hardcoded defaults in code

---

### 🔐 **SUPABASE (User Auth) - NOT USED**

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

**Required for:** User authentication (if implemented)  
**Without it:** No impact, auth not currently used  
**Fallback:** N/A - feature not active

---

## 🎯 Recommendation for Your Cousin

### **Use Option 2: Minimal .env with Audio**

Create a file called `.env` in the project root:

```bash
# Vatican Audio Guide - Minimal Configuration
# This is all you need for audio to work!

EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio
```

That's it! Just one line.

---

## 📝 How to Create .env File

### On Windows:
```bash
# In the project folder
notepad .env
```

Paste this line:
```
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio
```

Save and close.

### On Mac/Linux:
```bash
# In the project folder
echo "EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio" > .env
```

---

## 🔄 After Creating .env

**IMPORTANT:** Restart the development server!

```bash
# Stop the current server (Ctrl+C)
# Then restart with clear cache
yarn start --clear
```

The app needs to reload to pick up the new environment variables.

---

## ❓ FAQ

### Q: Does the CDN URL require authentication?
**A:** No! The CDN URL is public. Anyone can access the audio files.

### Q: Will audio work without .env?
**A:** No. The app needs `EXPO_PUBLIC_AUDIO_CDN_BASE_URL` to know where to load audio from.

### Q: Can I use the app without internet?
**A:** Yes, if you download tours first. But you need internet initially to download them.

### Q: Do I need Sanity credentials?
**A:** No. The app has fallback mock data for tours.

### Q: Do I need Payload credentials?
**A:** No. Booking will just open a website URL instead.

### Q: What if I don't set any env variables?
**A:** The app will run perfectly fine! You just won't have audio playback.

---

## 🧪 Testing Each Option

### Test Option 1 (No .env):
```bash
# Delete .env if it exists
rm .env

# Start app
yarn dev

# Expected: App works, but audio doesn't play
```

### Test Option 2 (Audio only):
```bash
# Create minimal .env
echo "EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio" > .env

# Start app with clear cache
yarn start --clear

# Expected: App works AND audio plays!
```

### Test Option 3 (Full .env):
```bash
# Copy your full .env file
cp /path/to/your/.env .env

# Start app with clear cache
yarn start --clear

# Expected: Everything works including bookings
```

---

## 📊 Summary Table

| Feature | No .env | Minimal .env | Full .env |
|---------|---------|--------------|-----------|
| UI & Navigation | ✅ | ✅ | ✅ |
| Tour Listings | ✅ (mock) | ✅ (mock) | ✅ (real) |
| Language Switch | ✅ | ✅ | ✅ |
| GPS Tracking | ✅ | ✅ | ✅ |
| Map Display | ✅ | ✅ | ✅ |
| **Audio Playback** | ❌ | ✅ | ✅ |
| Download Tours | ❌ | ✅ | ✅ |
| Booking System | ❌ | ❌ | ✅ |
| Sanity CMS Data | ❌ | ❌ | ✅ |

---

## 🎯 Final Recommendation

**Tell your cousin to create a `.env` file with just this one line:**

```bash
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio
```

**Then restart the app:**
```bash
yarn start --clear
```

**That's all they need! Audio will work perfectly.** 🎉

---

## 🆘 Troubleshooting

### Audio still not playing?

1. **Check .env file exists:**
   ```bash
   cat .env
   # Should show: EXPO_PUBLIC_AUDIO_CDN_BASE_URL=...
   ```

2. **Restart with clear cache:**
   ```bash
   yarn start --clear
   ```

3. **Check internet connection:**
   - Audio streams from CDN
   - Needs active internet

4. **Test CDN URL directly:**
   - Open in browser: `https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio/en/colosseum/deep/playlist.m3u8`
   - Should download or show playlist

5. **Check console logs:**
   - Look for `[Audio]` logs
   - Should show the audio URL being loaded

---

## ✅ Checklist for Your Cousin

- [ ] Clone repository
- [ ] Run `yarn install`
- [ ] Create `.env` file with CDN URL
- [ ] Run `yarn start --clear`
- [ ] Scan QR code with Expo Go
- [ ] Test audio playback
- [ ] Enjoy the app! 🎉

**That's it! No other environment variables needed!** 🚀
