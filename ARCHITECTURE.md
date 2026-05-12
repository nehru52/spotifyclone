# 🏗️ Vatican Audio Guide - Architecture

## System Overview

The Vatican Audio Guide app uses a **multi-backend architecture** to separate concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    VATICAN AUDIO GUIDE APP                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Sanity CMS │  │  Payload CMS │  │   Supabase   │      │
│  │              │  │              │  │              │      │
│  │ Tour Content │  │   Bookings   │  │  User Auth   │      │
│  │   & Images   │  │   & Tickets  │  │  & Profiles  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  Content Layer │                        │
│                    │  (src/services)│                        │
│                    └────────────────┘                        │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │   React Native │                        │
│                    │   Components   │                        │
│                    └────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Backend Services

### 1. **Sanity CMS** - Tour Content & Media
**Purpose**: Store and manage all tour-related content

**What it stores**:
- ✅ Tour information (title, description, duration, category)
- ✅ Sight/stop details (name, location, GPS coordinates)
- ✅ Images (thumbnails, photos)
- ✅ Audio file metadata (URLs, durations, languages)
- ✅ Transcripts and tips
- ✅ Multi-language content

**API Endpoint**: `https://aknmkkwd.api.sanity.io/v2024-01-01/data/query/production`

**Authentication**: Bearer token (API token in .env)

**Service File**: `src/services/sanity.ts`

**Key Functions**:
```typescript
fetchSightsFromSanity()      // Get all sights/stops
fetchAudioToursFromSanity()  // Get all tours
```

---

### 2. **Payload CMS** - Bookings & Tickets
**Purpose**: Manage tour bookings and ticket validation

**What it stores**:
- ✅ User bookings (from website)
- ✅ Ticket information (codes, QR codes, status)
- ✅ Booking status (pending, confirmed, cancelled)
- ✅ Payment information

**API Endpoint**: `https://admin.wondersofrome.com/api`

**Authentication**: API Key (in .env)

**Service File**: `src/services/booking.ts`

**Key Functions**:
```typescript
fetchUserBookings(email)           // Get user's bookings
fetchUserTickets(email)            // Get user's tickets
validateTicket(ticketCode)         // Validate a ticket
syncBookingsFromWebsite(email)     // Sync from website
hasValidTicketForTour(email, tourId) // Check ticket validity
```

---

### 3. **Supabase** - User Authentication & Data
**Purpose**: Handle user accounts and app-specific data

**What it stores**:
- ✅ User accounts (email, password)
- ✅ User profiles (name, avatar, preferences)
- ✅ Cached ticket data (for offline access)
- ✅ User preferences and settings

**API Endpoint**: `https://ogrvhooygcoazracbvkb.supabase.co`

**Authentication**: Anon key + JWT tokens

**Service File**: `src/services/supabase.ts`

**Key Functions**:
```typescript
signUp(email, password, name)      // Create account
signIn(email, password)            // Login
signOut()                          // Logout
getCurrentUser()                   // Get logged-in user
getUserProfile(userId)             // Get user profile
storeUserTicket(ticketData)        // Cache ticket locally
getUserTickets()                   // Get cached tickets
```

---

### 4. **Cloudflare R2** - Audio File Storage
**Purpose**: CDN for audio files

**What it stores**:
- ✅ Audio tour files (MP3)
- ✅ Multiple languages (en, it, es, fr, de, etc.)
- ✅ Multiple variants (quick, deep, kids)

**Base URL**: `https://pub-8c2c698c5e7e4c8b9e3f1a2b3c4d5e6f.r2.dev`

**Structure**:
```
/{language}/{sight-id}/{variant}.mp3

Examples:
/en/vatican-museums/deep.mp3
/it/st-peters-basilica/quick.mp3
/en/sistine-chapel/kids.mp3
```

---

## Data Flow

### Tour Content Flow
```
Sanity CMS → fetchTours() → App UI
```

1. User opens app
2. App calls `fetchTours()` from `src/services/content.ts`
3. Content service routes to Sanity based on `.env` config
4. Sanity returns tour data with images and audio URLs
5. App displays tours to user

### Booking Flow (Website → App)
```
Website Booking → Payload CMS → App Sync → Supabase Cache → Display Ticket
```

1. User books tour on **wondersofrome.com**
2. Website creates booking in **Payload CMS**
3. User logs into **app** with same email
4. App calls `syncBookingsFromWebsite(email)`
5. Booking service fetches from **Payload**
6. Ticket data cached in **Supabase** for offline access
7. App displays ticket with QR code

### Ticket Validation Flow
```
User Shows Ticket → Scan QR → Validate with Payload → Update Status
```

1. User opens ticket in app
2. Staff scans QR code
3. App calls `validateTicket(ticketCode)`
4. Payload checks ticket status
5. Returns valid/invalid/used status

---

## Configuration

### Environment Variables (`.env`)

```env
# Content Provider (which backend to use for tours)
EXPO_PUBLIC_CONTENT_PROVIDER=sanity

# Sanity CMS
EXPO_PUBLIC_SANITY_PROJECT_ID=aknmkkwd
EXPO_PUBLIC_SANITY_DATASET=production
EXPO_PUBLIC_SANITY_API_TOKEN=sk...

# Payload CMS
EXPO_PUBLIC_PAYLOAD_BASE_URL=https://admin.wondersofrome.com
EXPO_PUBLIC_PAYLOAD_API_KEY=oUXeNps...

# Cloudflare R2
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://pub-...r2.dev

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://ogrvhooygcoazracbvkb.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Website
EXPO_PUBLIC_WEBSITE_URL=https://wondersofrome.com
EXPO_PUBLIC_BOOKING_URL=https://wondersofrome.com/book
```

---

## Service Layer

### `src/services/content.ts` - Unified Content API
Main entry point for fetching tours and sights. Routes to correct backend based on config.

```typescript
import { fetchTours, fetchSights } from './services/content';

// Automatically uses Sanity/Payload/Mock based on .env
const tours = await fetchTours();
const sights = await fetchSights();
```

### `src/services/sanity.ts` - Sanity Integration
Handles all Sanity CMS queries using GROQ.

### `src/services/payload.ts` - Payload Integration
Handles bookings and tickets from Payload CMS.

### `src/services/booking.ts` - Booking Management
High-level booking operations (sync, validate, check).

### `src/services/supabase.ts` - Authentication & Storage
User auth and local data caching.

---

## Website Integration

### Booking Flow
1. User visits **wondersofrome.com**
2. Browses tours and selects one
3. Clicks "Book Now" → redirected to booking page
4. Fills in details and pays
5. Booking created in **Payload CMS** with:
   - User email
   - Tour ID
   - Booking date
   - Ticket code
   - QR code

### App Sync
1. User downloads app
2. Signs up/logs in with **same email** used on website
3. App automatically syncs bookings from Payload
4. Tickets appear in "My Tickets" section
5. User can access tickets offline (cached in Supabase)

---

## Offline Support

### What Works Offline
- ✅ View cached tours
- ✅ View cached tickets
- ✅ Play downloaded audio files
- ✅ View user profile

### What Requires Internet
- ❌ Fetch new tours
- ❌ Sync bookings from website
- ❌ Validate tickets
- ❌ Update user profile

---

## Security

### API Keys
- Sanity API token: Read-only access to published content
- Payload API key: Read access to user's own bookings
- Supabase anon key: Row-level security enforced

### Data Access
- Users can only see their own bookings
- Ticket validation requires valid ticket code
- Audio files are publicly accessible (CDN)

---

## Next Steps

### Phase 1: Basic Integration ✅
- [x] Configure Sanity CMS
- [x] Configure Payload CMS
- [x] Configure Supabase
- [x] Create service layer
- [x] Test data fetching

### Phase 2: UI Integration (Current)
- [ ] Replace Spotify UI with Vatican tours
- [ ] Create tour detail screens
- [ ] Implement audio player
- [ ] Add booking/ticket screens

### Phase 3: Advanced Features
- [ ] GPS-triggered audio playback
- [ ] Offline mode with downloads
- [ ] Multi-language support
- [ ] Interactive maps
- [ ] Push notifications for tour reminders

---

## Testing

### Test with Mock Data
```env
EXPO_PUBLIC_CONTENT_PROVIDER=mock
```

### Test with Sanity (Real Tours)
```env
EXPO_PUBLIC_CONTENT_PROVIDER=sanity
```

### Test Booking Sync
1. Create test booking in Payload
2. Use same email in app
3. Call `syncBookingsFromWebsite(email)`
4. Verify ticket appears

---

## Support

- **Sanity Studio**: https://wondersofrome.sanity.studio
- **Payload Admin**: https://admin.wondersofrome.com
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Website**: https://wondersofrome.com

---

**Last Updated**: May 8, 2026
