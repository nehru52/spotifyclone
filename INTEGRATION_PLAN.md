# Integration Plan: Spotify Clone + Wonders of Rome

## 🎯 Goal
Merge the Spotify clone's excellent UI with Wonders of Rome's proven backend (Sanity + Cloudflare R2) to create the ultimate Vatican Audio Guide.

## 📊 What We're Combining

### From Spotify Clone ✅
- Modern, polished UI components
- Smooth navigation and animations
- Music player-style interface
- Bottom tab navigation
- Card-based layouts
- Search and filtering

### From Wonders of Rome ✅
- Sanity CMS integration
- Cloudflare R2 audio storage
- Multi-language support (12 languages!)
- Audio variants (quick, deep, kids)
- Offline audio caching
- GPS geofencing
- Progress tracking with SQLite
- Queue management
- Background audio playback

## 🔄 Integration Strategy

### Phase 1: Setup Environment
1. Copy Sanity service from Wonders of Rome
2. Copy audio service with R2 integration
3. Copy filesystem service for offline caching
4. Copy SQLite service for progress tracking
5. Update package.json with required dependencies

### Phase 2: Update Data Models
1. Extend Tour type to match Sanity schema
2. Add multi-language support
3. Add audio variants (quick/deep/kids)
4. Add offline caching support

### Phase 3: Create Integrated Services
1. **ContentService** - Fetch from Sanity
2. **AudioService** - Stream from R2 + offline cache
3. **ProgressService** - SQLite tracking
4. **GeofencingService** - GPS triggers

### Phase 4: Update UI Components
1. Keep Spotify UI components
2. Add language selector
3. Add audio variant selector
4. Add offline download indicators
5. Add progress indicators

### Phase 5: Testing
1. Test Sanity data fetching
2. Test R2 audio streaming
3. Test offline mode
4. Test GPS triggers
5. Test multi-language

## 📦 Required Dependencies

```json
{
  "@supabase/supabase-js": "^2.98.0",
  "expo-audio": "~55.0.8",
  "expo-file-system": "~55.0.12",
  "expo-sqlite": "~55.0.10",
  "expo-task-manager": "~55.0.9"
}
```

## 🗂️ File Structure

```
spotify-clone/
├── src/
│   ├── services/
│   │   ├── sanity.ts          ← From Wonders of Rome
│   │   ├── audio.ts           ← From Wonders of Rome (enhanced)
│   │   ├── filesystem.ts      ← From Wonders of Rome
│   │   ├── sqlite.ts          ← From Wonders of Rome
│   │   ├── content.ts         ← From Wonders of Rome
│   │   └── geofencing.ts      ← From Wonders of Rome
│   │
│   ├── types/
│   │   └── index.ts           ← Merged types
│   │
│   ├── config/
│   │   ├── sanity.ts          ← Sanity config
│   │   └── audioCdn.ts        ← R2 CDN config
│   │
│   └── components/            ← Keep Spotify UI
│       └── Tours/
│
└── .env.example               ← Add Sanity + R2 config
```

## 🔑 Environment Variables

```env
# Sanity CMS
EXPO_PUBLIC_SANITY_PROJECT_ID=your-project-id
EXPO_PUBLIC_SANITY_DATASET=production

# Cloudflare R2 CDN
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://your-r2-bucket.r2.dev

# Optional
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

## 🎨 UI Enhancements

### Language Selector
```typescript
<LanguageSelector
  languages={['en', 'it', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'pl', 'ru', 'ar', 'ko']}
  selected={currentLang}
  onChange={setLanguage}
/>
```

### Audio Variant Selector
```typescript
<VariantSelector
  variants={['quick', 'deep', 'kids']}
  selected={currentVariant}
  onChange={setVariant}
/>
```

### Offline Indicator
```typescript
<OfflineIndicator
  isDownloaded={isOffline}
  onDownload={downloadAudio}
  progress={downloadProgress}
/>
```

## 🚀 Migration Steps

### Step 1: Copy Core Services
```bash
cp wondersofrome_app/src/services/sanity.ts spotify-clone/services/
cp wondersofrome_app/src/services/audio.ts spotify-clone/services/
cp wondersofrome_app/src/services/filesystem.ts spotify-clone/services/
cp wondersofrome_app/src/services/sqlite.ts spotify-clone/services/
cp wondersofrome_app/src/services/content.ts spotify-clone/services/
```

### Step 2: Copy Config
```bash
cp wondersofrome_app/src/config/sanity.ts spotify-clone/config/
cp wondersofrome_app/src/config/audioCdn.ts spotify-clone/config/
```

### Step 3: Copy Types
```bash
cp wondersofrome_app/src/types/index.ts spotify-clone/types/
```

### Step 4: Update Dependencies
```bash
cd spotify-clone
yarn add @supabase/supabase-js expo-audio expo-sqlite expo-task-manager
```

### Step 5: Update .env
```bash
cp wondersofrome_app/.env.example spotify-clone/.env.example
# Then fill in your values
```

## 🎯 Key Features After Integration

### ✅ Content Management
- Sanity CMS for easy content updates
- No code changes needed for new tours
- Rich media support

### ✅ Audio Delivery
- Cloudflare R2 for fast, global delivery
- Automatic offline caching
- Resume playback support
- Background audio

### ✅ Multi-Language
- 12 languages supported
- Easy language switching
- Per-language audio files

### ✅ Audio Variants
- **Quick** - Short highlights (2-3 min)
- **Deep** - Detailed commentary (5-7 min)
- **Kids** - Child-friendly content

### ✅ Offline Mode
- Download tours for offline use
- Automatic caching of played audio
- Progress syncs when online

### ✅ GPS Features
- Geofencing with background tasks
- Auto-play when near locations
- Distance calculations

### ✅ Progress Tracking
- SQLite for local storage
- Resume from last position
- Track completed tours

## 📝 Data Flow

```
Sanity CMS
    ↓
ContentService.fetchSights()
    ↓
Sight[] with R2 URLs
    ↓
AudioService.playAudio()
    ↓
Check local cache (FileSystem)
    ↓
If not cached → Stream from R2
    ↓
Download in background for offline
    ↓
Save progress (SQLite)
```

## 🔧 Configuration

### Sanity Schema
Your Sanity schema should have:
- `sight` documents with:
  - `slug` (unique ID)
  - `name`, `name_it` (multilingual names)
  - `lat`, `lng` (GPS coordinates)
  - `radius` (geofence radius)
  - `audio_en`, `audio_it`, etc. (audio files per language)
  - Each audio has `audioQuick`, `audioDeep`, `audioKids`

### R2 Bucket Structure
```
your-bucket/
├── en/
│   ├── st-peters-basilica/
│   │   ├── quick.mp3
│   │   ├── deep.mp3
│   │   └── kids.mp3
│   ├── sistine-chapel/
│   │   └── deep.mp3
│   └── ...
├── it/
│   └── ...
└── es/
    └── ...
```

## 🎉 Benefits

### For Users
- Beautiful, familiar Spotify-like interface
- Fast audio streaming from R2
- Offline mode for Vatican visit
- Multiple languages
- Different audio lengths (quick/deep/kids)
- Resume playback
- Background audio

### For You
- Easy content management via Sanity
- No app updates for new content
- Scalable audio delivery via R2
- Proven architecture from Wonders of Rome
- Modern UI from Spotify clone

## 🚦 Next Steps

1. ✅ Review this plan
2. ⏳ Copy services from Wonders of Rome
3. ⏳ Update package.json
4. ⏳ Configure .env with Sanity + R2
5. ⏳ Test Sanity data fetching
6. ⏳ Test R2 audio streaming
7. ⏳ Update UI components
8. ⏳ Test offline mode
9. ⏳ Test GPS features
10. ⏳ Launch!

---

**Ready to proceed?** Let me know and I'll start the integration!
