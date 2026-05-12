# 🔧 Backend Setup Guide

## 3 Ways to Run the App

### 1. 🎯 MOCK MODE (No Backend - Recommended for Testing)

**Perfect for:** Testing the UI without any backend setup

**Setup:**
```env
# .env file
EXPO_PUBLIC_CONTENT_PROVIDER=mock
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://your-r2-bucket.r2.dev
```

**What you get:**
- ✅ 3 sample Vatican tours
- ✅ Sample audio stops with GPS coordinates
- ✅ Works immediately - no backend needed
- ✅ Perfect for UI testing and development

**Run it:**
```bash
yarn dev:android
```

---

### 2. 🌐 PAYLOAD CMS MODE (Your Existing Backend)

**Perfect for:** Using your real Wonders of Rome data

**Setup:**
```env
# .env file
EXPO_PUBLIC_CONTENT_PROVIDER=payload
EXPO_PUBLIC_PAYLOAD_BASE_URL=https://wondersofrome.com
EXPO_PUBLIC_PAYLOAD_SIGHTS_COLLECTION=sights
EXPO_PUBLIC_PAYLOAD_TOURS_COLLECTION=tours
EXPO_PUBLIC_PAYLOAD_AUDIO_TOURS_COLLECTION=audio-tours
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://your-r2-bucket.r2.dev
```

**What you need:**
- ✅ Payload CMS running at wondersofrome.com
- ✅ API endpoints accessible
- ✅ Collections: sights, tours, audio-tours
- ✅ Cloudflare R2 bucket with audio files

**Run it:**
```bash
yarn dev:android
```

---

### 3. 📝 SANITY CMS MODE (Alternative Backend)

**Perfect for:** If you want to use Sanity instead of Payload

**Setup:**
```env
# .env file
EXPO_PUBLIC_CONTENT_PROVIDER=sanity
EXPO_PUBLIC_SANITY_PROJECT_ID=your-project-id
EXPO_PUBLIC_SANITY_DATASET=production
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://your-r2-bucket.r2.dev
```

**What you need:**
- ✅ Sanity project created
- ✅ Schema defined (sight, audioTour)
- ✅ Content added
- ✅ Cloudflare R2 bucket with audio files

**Run it:**
```bash
yarn dev:android
```

---

## 📋 Complete .env Template

```env
# ═══════════════════════════════════════════════════════════════════════════
# Vatican Audio Guide - Environment Configuration
# ═══════════════════════════════════════════════════════════════════════════

# ── CHOOSE YOUR MODE ──────────────────────────────────────────────────────────
# Options: 'mock' | 'payload' | 'sanity'
EXPO_PUBLIC_CONTENT_PROVIDER=mock

# ── MOCK MODE (No Backend) ────────────────────────────────────────────────────
# Just set EXPO_PUBLIC_CONTENT_PROVIDER=mock above
# No other configuration needed!

# ── PAYLOAD CMS MODE ──────────────────────────────────────────────────────────
# EXPO_PUBLIC_CONTENT_PROVIDER=payload
# EXPO_PUBLIC_PAYLOAD_BASE_URL=https://wondersofrome.com
# EXPO_PUBLIC_PAYLOAD_SIGHTS_COLLECTION=sights
# EXPO_PUBLIC_PAYLOAD_TOURS_COLLECTION=tours
# EXPO_PUBLIC_PAYLOAD_AUDIO_TOURS_COLLECTION=audio-tours

# ── SANITY CMS MODE ───────────────────────────────────────────────────────────
# EXPO_PUBLIC_CONTENT_PROVIDER=sanity
# EXPO_PUBLIC_SANITY_PROJECT_ID=abc123xyz
# EXPO_PUBLIC_SANITY_DATASET=production

# ── CLOUDFLARE R2 (Audio Files) ───────────────────────────────────────────────
# Required for all modes (mock uses placeholder URLs)
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://pub-8c2c698c5e7e4c8b9e3f1a2b3c4d5e6f.r2.dev

# ── OPTIONAL ──────────────────────────────────────────────────────────────────
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your-mapbox-token
EXPO_PUBLIC_BRAND_DOMAIN=https://wondersofrome.com
```

---

## 🚀 Quick Start (Mock Mode)

1. **Install dependencies:**
```bash
cd spotify-clone
yarn install
```

2. **Verify .env file:**
```bash
# Make sure it says:
EXPO_PUBLIC_CONTENT_PROVIDER=mock
```

3. **Run on Android:**
```bash
yarn dev:android
```

4. **You'll see:**
- 3 sample Vatican tours
- St. Peter's Basilica Tour
- Vatican Museums Highlights
- Vatican Gardens Tour

---

## 🔄 Switching Between Modes

### From Mock → Payload:
```env
# Change this line in .env:
EXPO_PUBLIC_CONTENT_PROVIDER=payload

# Add these lines:
EXPO_PUBLIC_PAYLOAD_BASE_URL=https://wondersofrome.com
EXPO_PUBLIC_PAYLOAD_SIGHTS_COLLECTION=sights
EXPO_PUBLIC_PAYLOAD_TOURS_COLLECTION=tours
EXPO_PUBLIC_PAYLOAD_AUDIO_TOURS_COLLECTION=audio-tours
```

### From Mock → Sanity:
```env
# Change this line in .env:
EXPO_PUBLIC_CONTENT_PROVIDER=sanity

# Add these lines:
EXPO_PUBLIC_SANITY_PROJECT_ID=your-project-id
EXPO_PUBLIC_SANITY_DATASET=production
```

---

## 🎯 Recommended Development Flow

1. **Start with Mock Mode** ✅
   - Test UI and navigation
   - Verify layouts and components
   - No backend setup needed

2. **Switch to Payload Mode** 
   - Connect to your real data
   - Test with actual tours
   - Verify API integration

3. **Production Ready** 🚀
   - All features working
   - Real data flowing
   - Audio streaming from R2

---

## 🆘 Troubleshooting

### App shows "No tours found"
**Solution:** Check your `EXPO_PUBLIC_CONTENT_PROVIDER` setting
- If `mock` - should work immediately
- If `payload` - check backend URL and collections
- If `sanity` - check project ID and dataset

### "Cannot connect to backend"
**Solution:** 
1. Switch to mock mode temporarily:
   ```env
   EXPO_PUBLIC_CONTENT_PROVIDER=mock
   ```
2. Verify backend is accessible
3. Check API endpoints return data

### Audio not playing
**Solution:**
- Verify `EXPO_PUBLIC_AUDIO_CDN_BASE_URL`
- Check R2 bucket is public
- Verify audio file paths

---

## 📊 What Each Mode Provides

| Feature | Mock | Payload | Sanity |
|---------|------|---------|--------|
| Sample Tours | ✅ 3 tours | ✅ Your data | ✅ Your data |
| GPS Coordinates | ✅ Yes | ✅ Yes | ✅ Yes |
| Audio Files | ⚠️ Placeholder URLs | ✅ Real R2 URLs | ✅ Real R2 URLs |
| Multi-Language | ✅ Structure ready | ✅ Full support | ✅ Full support |
| Offline Mode | ✅ Works | ✅ Works | ✅ Works |
| Backend Required | ❌ No | ✅ Yes | ✅ Yes |

---

## 🎉 You're Ready!

**Current setup:** Mock mode (no backend needed)
**Next step:** Run `yarn dev:android` and see your app!

When you're ready to use your real backend, just update the `.env` file and restart the app.
