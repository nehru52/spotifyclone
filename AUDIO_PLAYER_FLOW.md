# Audio Player Flow

## How It Works Now

### 1. **Home Screen** (`app/(tabs)/home/index.tsx`)
- Shows place cards (Colosseum, Roman Forum, etc.)
- When user taps a place card:
  - Calls `playTrack()` with track data (id, title, image, audioUrl)
  - Updates the global audio player context
- **NO audio player visible on home screen** - removed the inline player

### 2. **Mini Player** (`components/MiniPlayer/MiniPlayer.tsx`)
- **Position**: Bottom of screen, above tab bar
- **Shows when**: `currentTrack` exists in context
- **Displays**:
  - Album art (place image)
  - Track title
  - Play/Pause button
  - Progress bar
- **Action**: Tap anywhere to open full-screen player

### 3. **Full-Screen Player** (`app/player.tsx`)
- **Opens when**: User taps mini player
- **Gets data from**: `useAudioPlayerContext()` - uses the current track
- **Features**:
  - Blurred background with place image
  - Large album art
  - Track title and subtitle
  - Progress slider
  - Play/Pause (synced with mini player)
  - Skip, shuffle, repeat controls
- **Action**: Tap down arrow to minimize (go back)

## Audio State Management

### Context Provider (`context/AudioPlayerContext.tsx`)
```
AudioPlayerProvider
├── currentTrack (track data)
├── isPlaying (boolean)
├── playTrack() (start playing)
├── pauseTrack() (pause)
├── stopTrack() (stop and clear)
└── togglePlayPause() (toggle state)
```

### Flow:
1. User taps place card → `playTrack()` called
2. Context updates `currentTrack` and `isPlaying = true`
3. Mini player appears (because `currentTrack` exists)
4. User taps mini player → Navigate to `/player`
5. Full-screen player reads `currentTrack` from context
6. Play/Pause button calls `togglePlayPause()` → Updates context
7. Both mini player and full-screen player stay in sync

## Files Modified

### Removed:
- ❌ Inline AudioPlayer component from home screen
- ❌ `playerContainer` style

### Added:
- ✅ `AudioPlayerContext` - Global state management
- ✅ `AudioPlayerProvider` - Wraps entire app
- ✅ `MiniPlayer` component - Bottom player
- ✅ Full-screen player route (`/player`)

### Updated:
- ✅ Home screen - Uses context, removed inline player
- ✅ Tabs layout - Shows mini player when track exists
- ✅ Root layout - Wraps with AudioPlayerProvider

## Next Steps (Optional)
- [ ] Connect to actual audio playback (expo-av)
- [ ] Implement real progress tracking
- [ ] Add next/previous track functionality
- [ ] Persist playback state
- [ ] Add queue management
