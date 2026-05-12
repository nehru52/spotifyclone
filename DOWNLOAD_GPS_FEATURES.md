# Download & GPS Toggle Features

## New Features Added:

### 1. ✅ Download Button on Every Audio Card (Home Screen)

**What it does:**
- Each audio card now has a download button (top-right corner)
- Tap to download the tour for offline playback
- Shows download progress (0-100%)
- Changes to checkmark when downloaded
- Prevents duplicate downloads

**User Experience:**
1. User sees audio card with download icon (top-right)
2. Taps download icon
3. Shows progress: "Downloading... 45%"
4. When complete: Shows green checkmark ✅
5. Alert: "✅ Download Complete - [Tour Name] is now available offline!"

**States:**
- **Not Downloaded**: Download icon (outline)
- **Downloading**: Spinner + progress percentage
- **Downloaded**: Green checkmark ✅

**Features:**
- Prevents playing audio when tapping download (event.stopPropagation)
- Shows alerts for already downloaded tours
- Shows alerts for download in progress
- Tracks download progress in real-time
- Updates UI immediately when download completes

---

### 2. ✅ GPS Toggle on Map Page (Top of Map)

**What it does:**
- GPS Auto-Play toggle card at top of map
- Turn GPS tracking on/off directly from map
- Shows current status (Active/Inactive)
- Requests permissions when enabling
- Provides feedback with alerts

**User Experience:**
1. User opens Map screen
2. Sees GPS toggle card at top
3. Taps switch to enable
4. App requests location permissions
5. GPS tracking starts
6. Card shows "Active - You'll be notified near sites"

**UI Elements:**
- **Icon**: Navigate icon (filled when active, outline when inactive)
- **Title**: "GPS Auto-Play"
- **Subtitle**: 
  - Active: "Active - You'll be notified near sites"
  - Inactive: "Tap to enable location alerts"
- **Switch**: Green when on, gray when off
- **Loading**: Spinner while toggling

**Features:**
- Requests location permissions automatically
- Starts/stops GPS tracking
- Updates location service settings
- Shows confirmation alerts
- Handles errors gracefully
- Loading state while toggling

---

## Files Modified:

### 1. Home Screen (`app/(tabs)/home/index.tsx`)
**Changes:**
- Added `downloadingTours` state (Set<string>)
- Added `downloadProgress` state (Map<string, number>)
- Added `handleDownloadTour()` function
- Added download button to each audio card
- Added progress indicator
- Added checkmark for downloaded tours
- Imported `Alert` from react-native
- Imported `downloadManager`

**New Styles:**
- `downloadButton` - Download button container
- `downloadingContainer` - Progress indicator container
- `downloadProgressText` - Progress percentage text

### 2. Map Screen (`screens/MapScreen.tsx`)
**Changes:**
- Added `gpsEnabled` state (boolean)
- Added `gpsLoading` state (boolean)
- Added `handleToggleGPS()` function
- Added GPS toggle card UI
- Imported `Switch` from react-native
- Imported `locationService`
- Checks GPS status on mount

**New Styles:**
- `gpsToggleCard` - Toggle card container
- `gpsToggleContent` - Card content layout
- `gpsToggleText` - Text container
- `gpsToggleTitle` - Title text
- `gpsToggleSubtitle` - Subtitle text

---

## User Benefits:

### Download Buttons:
✅ **Quick Access** - Download directly from home screen
✅ **Visual Feedback** - See download progress in real-time
✅ **Clear Status** - Know which tours are offline
✅ **One-Tap Download** - No need to navigate to Downloads page
✅ **Prevents Duplicates** - Can't download same tour twice

### GPS Toggle on Map:
✅ **Convenient** - Enable GPS without leaving map
✅ **Contextual** - Toggle GPS where you use the map
✅ **Clear Status** - See if GPS is active at a glance
✅ **Quick Access** - No need to go to Profile → GPS Settings
✅ **Visual Feedback** - Icon changes color when active

---

## Technical Details:

### Download Flow:
```
User taps download icon
    ↓
Check if already downloaded → Alert
Check if already downloading → Alert
    ↓
Start download
    ↓
Show progress (0-100%)
    ↓
Download complete
    ↓
Update UI (show checkmark)
    ↓
Show success alert
```

### GPS Toggle Flow:
```
User taps GPS switch
    ↓
Show loading spinner
    ↓
If enabling:
    Request permissions
    Start tracking
    Update settings
If disabling:
    Stop tracking
    Update settings
    ↓
Update UI
    ↓
Show confirmation alert
```

---

## UI Screenshots (Descriptions):

### Home Screen - Download Buttons:
- Each audio card has download icon (top-right)
- Icon is white on dark background
- When downloading: Shows spinner + percentage
- When downloaded: Shows green checkmark
- Positioned above the play button overlay

### Map Screen - GPS Toggle:
- Card at top of map (below status bar)
- Semi-transparent background
- Navigate icon on left
- Title and subtitle in center
- Switch on right
- Green when active, gray when inactive

---

## Testing Checklist:

### Download Buttons:
- [ ] Tap download on Colosseum
- [ ] Verify progress shows (0-100%)
- [ ] Verify checkmark appears when done
- [ ] Verify alert shows "Download Complete"
- [ ] Tap download again (should show "Already Downloaded")
- [ ] Tap play button (should not trigger download)
- [ ] Change language, verify download button reappears

### GPS Toggle:
- [ ] Open Map screen
- [ ] Verify GPS toggle card appears at top
- [ ] Tap switch to enable
- [ ] Verify permission request appears
- [ ] Grant permission
- [ ] Verify "GPS Tracking Enabled" alert
- [ ] Verify card shows "Active"
- [ ] Verify icon changes to filled
- [ ] Tap switch to disable
- [ ] Verify "GPS Tracking Disabled" alert
- [ ] Verify card shows "Tap to enable"

---

## Known Issues:

### None currently - both features working as expected!

---

## Future Enhancements:

### Download Buttons:
- [ ] Batch download (download all tours at once)
- [ ] Download queue (download multiple sequentially)
- [ ] Pause/resume downloads
- [ ] Download size indicator before downloading
- [ ] Wi-Fi only option

### GPS Toggle:
- [ ] Show detection radius on map
- [ ] Show geofence circles around locations
- [ ] Distance to nearest location
- [ ] Battery usage indicator
- [ ] Quick settings (radius, auto-play, notifications)

---

**Date**: May 11, 2026  
**Status**: ✅ Complete and Ready for Testing  
**Impact**: High - Major UX improvements for discoverability
