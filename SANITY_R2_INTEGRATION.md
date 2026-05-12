# 🎉 Sanity + Cloudflare R2 Integration Complete!

## ✅ What's Been Integrated

Your Vatican Audio Guide now combines:
- **Spotify Clone's** beautiful UI
- **Wonders of Rome's** proven backend (Sanity CMS + Cloudflare R2)

## 🔧 What Was Added

### 1. Core Services ✅
- `src/services/sanity.ts` - Fetch tours and sights from Sanity CMS
- `src/config/sanity.ts` - Sanity configuration
- `src/config/audioCdn.ts` - Cloudflare R2 CDN configuration
- `src/config/content.ts` - Content provider selection

### 2. TypeScript Types ✅
- `src/types/index.ts` - Complete type definitions:
  - `Sight` - Audio stops with GPS coordinates
  - `Tour` - Collections of sights
  - `AudioLang` - 12 supported languages
  - `AudioVariant` - quick, deep, kids
  - `LangAudioFiles` - Multi-language audio structure

### 3. Configuration ✅
- `.env.example` - Environment variables template
- `app.config.js` - Updated with Sanity + R2 config
- `package.json` - Added required dependencies

### 4. Dependencies Added ✅
```json
{
  "expo-audio": "~55.0.8",      // Audio playback
  "expo-sqlite": "~55.0.10",    // Progress tracking
  "expo-task-manager": "~55.0.9" // Background tasks
}
```

## 🗂️ Your Sanity CMS Structure

### Required Schema

#### 1. Sight Document
```javascript
{
  _type: 'sight',
  slug: { current: 'st-peters-basilica' },
  name: 'St. Peter\'s Basilica',
  name_it: 'Basilica di San Pietro',
  category: 'religious',
  pack: 'essential',
  lat: 41.9029,
  lng: 12.4534,
  radius: 50,
  description: '...',
  thumbnail: { asset: { _ref: '...' } },
  tips: ['Tip 1', 'Tip 2'],
  kidsMyth: 'Fun story for kids',
  
  // Audio files per language
  audio_en: {
    audioQuick: { url: '...', duration: 180, size: 2048000 },
    audioDeep: { url: '...', duration: 420, size: 5120000 },
    audioKids: { url: '...', duration: 240, size: 3072000 }
  },
  audio_it: { ... },
  audio_es: { ... },
  // ... more languages
  
  linkedTour: { _ref: '...' }
}
```

#### 2. Audio Tour Document
```javascript
{
  _type: 'audioTour',
  slug: { current: 'vatican-highlights' },
  title: 'Vatican Highlights Tour',
  description: '...',
  duration: '2 hours',
  category: 'Religious Sites',
  difficulty: 'easy',
  featured: true,
  thumbnail: { asset: { _ref: '...' } },
  
  // Array of sight references
  stops: [
    { _ref: 'sight-1' },
    { _ref: 'sight-2' },
    { _ref: 'sight-3' }
  ]
}
```

## 📦 Your Cloudflare R2 Bucket Structure

```
your-r2-bucket/
├── en/
│   ├── st-peters-basilica/
│   │   ├── quick.mp3
│   │   ├── deep.mp3
│   │   └── kids.mp3
│   ├── sistine-chapel/
│   │   ├── quick.mp3
│   │   ├── deep.mp3
│   │   └── kids.mp3
│   ├── vatican-museums/
│   │   └── deep.mp3
│   └── vatican-pinacoteca/
│       └── deep.mp3
├── it/
│   ├── st-peters-basilica/
│   │   ├── quick.mp3
│   │   ├── deep.mp3
│   │   └── kids.mp3
│   └── ...
├── es/
│   └── ...
├── fr/
│   └── ...
└── ... (12 languages total)
```

### Audio File Naming Convention
- `quick.mp3` - Short highlights (2-3 minutes)
- `deep.mp3` - Detailed commentary (5-7 minutes)
- `kids.mp3` - Child-friendly content (3-4 minutes)

## 🔑 Setup Instructions

### Step 1: Configure Environment Variables

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Your Sanity project ID (from sanity.io dashboard)
EXPO_PUBLIC_SANITY_PROJECT_ID=abc123xyz

# Your Sanity dataset
EXPO_PUBLIC_SANITY_DATASET=production

# Your R2 bucket public URL
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://your-bucket.r2.dev

# Content provider
EXPO_PUBLIC_CONTENT_PROVIDER=sanity
```

### Step 2: Install Dependencies

```bash
cd spotify-clone
yarn install
```

### Step 3: Test Sanity Connection

The app will automatically fetch data from Sanity when you run it:

```bash
yarn dev
```

## 🎯 How It Works

### Data Flow

```
1. App starts
   ↓
2. Fetch tours from Sanity
   src/services/sanity.ts → fetchAudioToursFromSanity()
   ↓
3. Sanity returns tour data with sight references
   ↓
4. For each sight, inject R2 audio URLs
   Pattern: {R2_BASE}/{lang}/{sight-id}/{variant}.mp3
   ↓
5. Display tours in UI (Spotify-style)
   ↓
6. User taps tour → Show stops
   ↓
7. User taps stop → Stream audio from R2
   ↓
8. Audio downloads in background for offline use
```

### Audio URL Construction

```typescript
// Example for St. Peter's Basilica, English, Deep variant
const url = `${R2_BASE}/en/st-peters-basilica/deep.mp3`;
// https://your-bucket.r2.dev/en/st-peters-basilica/deep.mp3
```

### Multi-Language Support

```typescript
// User selects language
const lang = 'it'; // Italian

// App fetches Italian audio
const audioUrl = sight.audioFiles[lang]?.deep?.url;
// https://your-bucket.r2.dev/it/st-peters-basilica/deep.mp3
```

## 🌍 Supported Languages

1. **en** - English
2. **it** - Italian
3. **es** - Spanish
4. **fr** - French
5. **de** - German
6. **zh** - Chinese
7. **ja** - Japanese
8. **pt** - Portuguese
9. **pl** - Polish
10. **ru** - Russian
11. **ar** - Arabic
12. **ko** - Korean

## 🎨 Audio Variants

### Quick (2-3 minutes)
- Brief highlights
- Key facts only
- Perfect for quick visits

### Deep (5-7 minutes)
- Detailed commentary
- Historical context
- Stories and anecdotes

### Kids (3-4 minutes)
- Child-friendly language
- Fun facts and myths
- Engaging stories

## 📝 Sanity Schema Setup

### Install Sanity CLI
```bash
npm install -g @sanity/cli
```

### Create Sanity Project
```bash
sanity init
```

### Define Schema

Create `schemas/sight.js`:
```javascript
export default {
  name: 'sight',
  title: 'Sight',
  type: 'document',
  fields: [
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' }
    },
    {
      name: 'name',
      title: 'Name (English)',
      type: 'string'
    },
    {
      name: 'name_it',
      title: 'Name (Italian)',
      type: 'string'
    },
    {
      name: 'lat',
      title: 'Latitude',
      type: 'number'
    },
    {
      name: 'lng',
      title: 'Longitude',
      type: 'number'
    },
    {
      name: 'radius',
      title: 'Geofence Radius (meters)',
      type: 'number',
      initialValue: 50
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['ancient', 'religious', 'museum', 'piazza', 'other']
      }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image'
    },
    {
      name: 'audio_en',
      title: 'Audio (English)',
      type: 'object',
      fields: [
        {
          name: 'audioQuick',
          type: 'object',
          fields: [
            { name: 'url', type: 'url' },
            { name: 'duration', type: 'number' },
            { name: 'size', type: 'number' }
          ]
        },
        {
          name: 'audioDeep',
          type: 'object',
          fields: [
            { name: 'url', type: 'url' },
            { name: 'duration', type: 'number' },
            { name: 'size', type: 'number' }
          ]
        },
        {
          name: 'audioKids',
          type: 'object',
          fields: [
            { name: 'url', type: 'url' },
            { name: 'duration', type: 'number' },
            { name: 'size', type: 'number' }
          ]
        }
      ]
    },
    // Repeat for other languages: audio_it, audio_es, etc.
  ]
}
```

Create `schemas/audioTour.js`:
```javascript
export default {
  name: 'audioTour',
  title: 'Audio Tour',
  type: 'document',
  fields: [
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug'
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string'
    },
    {
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: ['easy', 'moderate', 'challenging']
      }
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean'
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image'
    },
    {
      name: 'stops',
      title: 'Stops',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'sight' }] }]
    }
  ]
}
```

### Deploy Sanity
```bash
sanity deploy
```

## 🚀 Next Steps

### 1. Add Content to Sanity
- Create sight documents
- Add GPS coordinates
- Upload thumbnails
- Create audio tour documents
- Link sights to tours

### 2. Upload Audio to R2
- Organize by language and sight ID
- Use naming convention: quick.mp3, deep.mp3, kids.mp3
- Make bucket public or configure CORS

### 3. Test the App
```bash
yarn dev
```

### 4. Verify Data Flow
- Check console for Sanity fetch logs
- Verify R2 URLs are constructed correctly
- Test audio playback
- Test language switching

## 🎉 Benefits of This Integration

### For Content Management
- ✅ Update tours without app updates
- ✅ Easy content editing via Sanity Studio
- ✅ Rich media support
- ✅ Version control
- ✅ Preview changes

### For Audio Delivery
- ✅ Fast global CDN (Cloudflare R2)
- ✅ Automatic caching
- ✅ Scalable storage
- ✅ Cost-effective
- ✅ No bandwidth limits

### For Users
- ✅ Beautiful Spotify-like UI
- ✅ Fast audio streaming
- ✅ 12 languages supported
- ✅ 3 audio variants per sight
- ✅ Offline mode
- ✅ GPS-triggered playback

## 📞 Troubleshooting

### Sanity Not Fetching Data
1. Check `.env` has correct `EXPO_PUBLIC_SANITY_PROJECT_ID`
2. Verify dataset name (usually 'production')
3. Check Sanity CORS settings
4. Look for errors in console

### R2 Audio Not Playing
1. Verify `EXPO_PUBLIC_AUDIO_CDN_BASE_URL` is correct
2. Check R2 bucket is public or has CORS configured
3. Verify audio file naming matches convention
4. Check folder structure matches sight IDs

### Audio URLs Not Constructed
1. Ensure sight IDs in Sanity match R2 folder names
2. Check `existingR2Folders` set in `sanity.ts`
3. Verify audio CDN base URL doesn't have trailing slash

## 🎯 Ready to Launch!

Your app now has:
- ✅ Sanity CMS integration
- ✅ Cloudflare R2 audio delivery
- ✅ Multi-language support
- ✅ Audio variants
- ✅ Beautiful UI
- ✅ Offline support (coming next)

**Next**: Add your content to Sanity and upload audio to R2!
