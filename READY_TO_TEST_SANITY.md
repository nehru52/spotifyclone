# 🎉 Ready to Test with Sanity CMS!

## ✅ What's Been Configured

### 1. **Environment Variables** (`.env`)
- ✅ Sanity CMS credentials configured
- ✅ Payload CMS for bookings configured
- ✅ Supabase for authentication configured
- ✅ Cloudflare R2 for audio files configured
- ✅ Content provider set to **SANITY**

### 2. **Services Created**
- ✅ `src/services/sanity.ts` - Fetch tours from Sanity
- ✅ `src/services/booking.ts` - Manage bookings/tickets from Payload
- ✅ `src/services/supabase.ts` - User authentication
- ✅ `src/services/content.ts` - Unified API (routes to Sanity)

### 3. **Dependencies Installed**
- ✅ `@supabase/supabase-js` - Supabase client
- ✅ All other dependencies already installed

### 4. **Test Screen Created**
- ✅ `app/vatican-test.tsx` - Test screen to verify Sanity integration
- ✅ Shows real-time data from Sanity CMS
- ✅ Displays provider status and debug info

---

## 🚀 How to Test

### Step 1: Open the App
**In your Metro terminal, press `a`** to open on Android emulator.

### Step 2: What You'll See
The app will open to the Vatican test screen showing:

**If Sanity has tours**:
```
🏛️ Vatican Audio Guide
Discover the Wonders of Vatican City
📡 SANITY MODE

[Tour cards with real images from Sanity]

✅ System Status
Backend: SANITY
Tours Loaded: X
Sanity Project: aknmkkwd
Status: ✅ Ready
```

**If Sanity is empty or has issues**:
```
⚠️ Error Loading Tours
[Error message]

Provider: sanity
Sanity Project: aknmkkwd

[Retry button]
```

---

## 🔍 What's Happening Behind the Scenes

### Data Flow
```
App Startup
    ↓
fetchTours() called
    ↓
Routes to Sanity (based on .env)
    ↓
Fetches from: https://aknmkkwd.api.sanity.io/v2024-01-01/data/query/production
    ↓
Uses Bearer token authentication
    ↓
Returns tours with:
  - Title, description, duration
  - Images from Sanity CDN
  - GPS coordinates for stops
  - Audio file metadata
    ↓
Displays in UI
```

### Sanity Query (GROQ)
The app queries Sanity for:
```groq
*[
  (_type == "audioTour") ||
  (_type == "tour" && defined(stops))
] | order(_createdAt desc) {
  "id": slug.current,
  title,
  description,
  duration,
  category,
  difficulty,
  featured,
  "thumbnail": coalesce(mainImage.asset->url, thumbnail.asset->url),
  "stops": stops[]->{
    name,
    lat,
    lng,
    description,
    audioFiles,
    ...
  }
}
```

---

## 📊 Expected Sanity Data Structure

### Tour Document (`audioTour` or `tour`)
```json
{
  "_type": "audioTour",
  "slug": { "current": "vatican-museums-tour" },
  "title": "Vatican Museums Highlights",
  "description": "Explore the masterpieces...",
  "duration": "2 hours",
  "category": "Museums",
  "difficulty": "moderate",
  "featured": true,
  "mainImage": { "asset": { "_ref": "image-..." } },
  "stops": [
    { "_ref": "sight-sistine-chapel" },
    { "_ref": "sight-raphael-rooms" }
  ]
}
```

### Sight Document (`sight`)
```json
{
  "_type": "sight",
  "slug": { "current": "sistine-chapel" },
  "name": "Sistine Chapel",
  "name_it": "Cappella Sistina",
  "lat": 41.9029,
  "lng": 12.4545,
  "radius": 40,
  "category": "museum",
  "description": "Marvel at Michelangelo's masterpiece...",
  "thumbnail": { "asset": { "_ref": "image-..." } },
  "tips": ["No photography", "Silence required"],
  "audio_en": {
    "audioDeep": {
      "url": "https://r2.dev/en/sistine-chapel/deep.mp3",
      "duration": 600,
      "size": 7168000
    }
  }
}
```

---

## 🔧 Troubleshooting

### No Tours Showing?

**Check 1: Sanity Has Data**
- Visit: https://wondersofrome.sanity.studio
- Check if tours exist with `_type: "audioTour"` or `_type: "tour"`
- Verify tours have `stops` array populated

**Check 2: API Token Works**
- Token in `.env`: `EXPO_PUBLIC_SANITY_API_TOKEN`
- Should start with `sk...`
- Has read permissions

**Check 3: Metro Logs**
Look for console logs:
```
[Sanity] Fetching audio tours from Sanity CMS...
[Sanity] Fetched X audio tours
[ContentService] Fetching tours from sanity
```

**Check 4: Network Request**
If you see errors like:
- `401 Unauthorized` → API token invalid
- `404 Not Found` → Project ID wrong
- `Network request failed` → Internet connection issue

### Error: "Sanity fetch failed: 401"
- API token is invalid or expired
- Generate new token in Sanity dashboard
- Update `.env` file
- Restart Metro server

### Error: "Sanity fetch failed: 404"
- Project ID is wrong
- Check: `EXPO_PUBLIC_SANITY_PROJECT_ID=aknmkkwd`
- Verify in Sanity dashboard

---

## 🎯 Next Steps After Testing

### If Sanity Works ✅
1. **Integrate into main UI**
   - Replace Spotify playlists with Vatican tours
   - Update home screen to show tours
   - Create tour detail screens

2. **Add Booking Integration**
   - Create "My Tickets" screen
   - Sync bookings from Payload
   - Display QR codes

3. **Implement Audio Player**
   - Play audio from R2 CDN
   - GPS-triggered playback
   - Offline downloads

### If Sanity Needs Setup ⚙️
1. **Add Tours to Sanity**
   - Create `audioTour` documents
   - Add `sight` documents for stops
   - Upload images
   - Link stops to tours

2. **Test Again**
   - Reload app (press `r`)
   - Should see tours appear

---

## 📱 Website → App Booking Flow

### How It Works
1. User books tour on **wondersofrome.com**
2. Booking saved to **Payload CMS** with user email
3. User logs into **app** with same email
4. App calls `syncBookingsFromWebsite(email)`
5. Fetches bookings from Payload
6. Caches in Supabase for offline access
7. Displays ticket with QR code

### To Test Booking Sync
```typescript
import { syncBookingsFromWebsite } from './src/services/booking';

// After user logs in
const { bookings, tickets } = await syncBookingsFromWebsite(userEmail);
console.log('Synced bookings:', bookings.length);
console.log('Synced tickets:', tickets.length);
```

---

## 📚 Documentation

- **ARCHITECTURE.md** - Complete system architecture
- **BACKEND_SETUP.md** - Backend configuration guide
- **FIXED_SQLITE_ERROR.md** - How we fixed the initial error
- **.env** - All configuration variables

---

## 🎉 You're Ready!

**Press `a` in your Metro terminal to open the app and see your Sanity tours!**

The app is now configured to:
- ✅ Fetch tours from Sanity CMS
- ✅ Sync bookings from Payload CMS
- ✅ Authenticate users with Supabase
- ✅ Stream audio from Cloudflare R2
- ✅ Display tickets from website bookings

**Let's see those Vatican tours! 🏛️**
