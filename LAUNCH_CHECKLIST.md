# Vatican Audio Guide - Launch Checklist

Print this checklist and check off items as you complete them!

## 📦 Phase 1: Setup & Installation

- [ ] Clone repository completed
- [ ] Node.js installed (v20+)
- [ ] Yarn installed (v1.22.17+)
- [ ] Dependencies installed (`yarn install`)
- [ ] App runs successfully (`yarn dev`)
- [ ] Expo Go installed on phone
- [ ] App opens on phone via QR code

## 📁 Phase 2: Content Preparation

### Audio Files
- [ ] All audio files recorded
- [ ] Audio files converted to MP3 (128kbps)
- [ ] Audio files organized by tour
- [ ] Audio files named sequentially (01-name.mp3)
- [ ] Audio files copied to `assets/audio/`
- [ ] Total audio size under 100MB

### Images
- [ ] Tour cover images prepared (1200x800px)
- [ ] Stop images prepared (800x600px)
- [ ] Images optimized/compressed
- [ ] Images copied to `assets/images/`
- [ ] App logo created (512x512px)
- [ ] Splash screen created (1242x2436px)

### Tour Data
- [ ] GPS coordinates collected for all stops
- [ ] Stop descriptions written
- [ ] Tour descriptions written
- [ ] Audio durations measured
- [ ] Trigger radius determined for each stop
- [ ] Tour categories defined
- [ ] Difficulty levels assigned

## ✏️ Phase 3: Data Entry

- [ ] Opened `data/vatican-tours.ts`
- [ ] Removed sample tours
- [ ] Added Tour #1 data
- [ ] Added Tour #2 data
- [ ] Added Tour #3 data
- [ ] Added Tour #4 data (if applicable)
- [ ] Added Tour #5 data (if applicable)
- [ ] All audio file paths correct
- [ ] All image paths correct
- [ ] All GPS coordinates entered
- [ ] All stop orders correct
- [ ] File saved without errors

## 🎨 Phase 4: Customization

### Branding
- [ ] App icon replaced (`assets/images/logo.png`)
- [ ] Splash screen replaced (`assets/images/splash.png`)
- [ ] Colors customized (`config/colors.ts`)
- [ ] App name confirmed (`app.config.js`)

### Text & Labels
- [ ] Welcome message updated (`data/en-gb.ts`)
- [ ] Button text reviewed
- [ ] Tour labels reviewed
- [ ] Error messages reviewed
- [ ] All text sounds natural

### Optional
- [ ] Italian translation added (`data/it-it.ts`)
- [ ] Spanish translation added (`data/es-es.ts`)
- [ ] French translation added (`data/fr-fr.ts`)
- [ ] German translation added (`data/de-de.ts`)

## 🧪 Phase 5: Testing - Desktop

### Basic Functionality
- [ ] App launches without errors
- [ ] Home screen displays correctly
- [ ] Featured tours appear
- [ ] Can navigate to Tours screen
- [ ] Tours list displays
- [ ] Category filters work
- [ ] Can tap on a tour
- [ ] Tour detail screen loads
- [ ] Tour information displays correctly
- [ ] Audio stops list appears

### Audio Playback
- [ ] Can tap on audio stop
- [ ] Audio player appears
- [ ] Audio file loads
- [ ] Play button works
- [ ] Pause button works
- [ ] Seek/scrub works
- [ ] Time display accurate
- [ ] Audio quality good
- [ ] Can close player
- [ ] Can switch between stops

### Features
- [ ] Can add tour to favorites
- [ ] Can remove from favorites
- [ ] Favorites persist after app restart
- [ ] Progress tracking works
- [ ] No console errors
- [ ] No warning messages

## 📱 Phase 6: Testing - Mobile Device

### Installation
- [ ] App installs via Expo Go
- [ ] App opens successfully
- [ ] No crash on launch
- [ ] All screens accessible

### UI/UX
- [ ] Text readable on phone screen
- [ ] Images load properly
- [ ] Buttons easy to tap
- [ ] Scrolling smooth
- [ ] Navigation intuitive
- [ ] Colors look good
- [ ] No layout issues

### Audio
- [ ] Audio plays on phone
- [ ] Volume controls work
- [ ] Audio continues in background
- [ ] Audio stops when expected
- [ ] No audio glitches
- [ ] Headphones work
- [ ] Speaker works

### Performance
- [ ] App responsive
- [ ] No lag when scrolling
- [ ] Images load quickly
- [ ] Audio loads quickly
- [ ] Battery usage reasonable
- [ ] No overheating

## 🗺️ Phase 7: GPS Testing (On-Site)

### Preparation
- [ ] Phone fully charged
- [ ] Headphones packed
- [ ] Backup battery packed
- [ ] Testing checklist printed
- [ ] Notebook for notes

### Location Permissions
- [ ] Location permission requested
- [ ] Permission granted
- [ ] GPS signal acquired
- [ ] Current location displayed

### Tour #1 Testing
- [ ] Started GPS tracking
- [ ] Walked to Stop 1
- [ ] Audio triggered automatically
- [ ] Audio content correct
- [ ] Walked to Stop 2
- [ ] Audio triggered automatically
- [ ] Walked to Stop 3
- [ ] Audio triggered automatically
- [ ] Completed full tour
- [ ] Progress saved correctly
- [ ] Stopped GPS tracking

### Tour #2 Testing
- [ ] Started GPS tracking
- [ ] Tested all stops
- [ ] All audio triggered correctly
- [ ] Completed full tour

### Tour #3 Testing
- [ ] Started GPS tracking
- [ ] Tested all stops
- [ ] All audio triggered correctly
- [ ] Completed full tour

### GPS Issues to Check
- [ ] No false triggers (audio playing too early)
- [ ] No missed triggers (audio not playing)
- [ ] Trigger radius appropriate
- [ ] GPS accuracy acceptable
- [ ] Battery drain acceptable
- [ ] Works indoors (if applicable)
- [ ] Works outdoors

### Adjustments Needed
- [ ] Stop 1: Radius adjusted to ___m
- [ ] Stop 2: Radius adjusted to ___m
- [ ] Stop 3: Radius adjusted to ___m
- [ ] Stop 4: Radius adjusted to ___m
- [ ] Stop 5: Radius adjusted to ___m

## 🔧 Phase 8: Bug Fixes & Polish

- [ ] All GPS issues resolved
- [ ] All audio issues resolved
- [ ] All UI issues resolved
- [ ] All performance issues resolved
- [ ] User feedback incorporated
- [ ] Final testing completed
- [ ] No known critical bugs

## 📸 Phase 9: App Store Materials

### Screenshots (iOS)
- [ ] 6.5" iPhone (1284 x 2778) - 3 screenshots
- [ ] 5.5" iPhone (1242 x 2208) - 3 screenshots
- [ ] 12.9" iPad (2048 x 2732) - 3 screenshots

### Screenshots (Android)
- [ ] Phone (1080 x 1920) - 3 screenshots
- [ ] 7" Tablet (1200 x 1920) - 3 screenshots
- [ ] 10" Tablet (1600 x 2560) - 3 screenshots

### App Description
- [ ] Short description written (80 chars)
- [ ] Full description written (4000 chars)
- [ ] Keywords selected
- [ ] Category selected
- [ ] Age rating determined

### Legal
- [ ] Privacy policy created
- [ ] Terms of service created
- [ ] Support email set up
- [ ] Support website created (optional)

## 🏗️ Phase 10: Production Build

### iOS Build
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Expo account created
- [ ] Logged in (`eas login`)
- [ ] Build configuration reviewed
- [ ] iOS build started (`eas build -p ios`)
- [ ] Build completed successfully
- [ ] IPA file downloaded
- [ ] App tested on TestFlight

### Android Build
- [ ] Android build started (`eas build -p android`)
- [ ] Build completed successfully
- [ ] APK/AAB file downloaded
- [ ] App tested on device

### Final Checks
- [ ] App icon displays correctly
- [ ] Splash screen displays correctly
- [ ] App name correct
- [ ] Version number correct
- [ ] No debug code left
- [ ] No console.log statements
- [ ] No test data

## 🚀 Phase 11: App Store Submission

### Apple App Store
- [ ] App Store Connect account created
- [ ] App created in App Store Connect
- [ ] Build uploaded
- [ ] Screenshots uploaded
- [ ] Description added
- [ ] Keywords added
- [ ] Privacy policy URL added
- [ ] Support URL added
- [ ] Pricing set
- [ ] Submitted for review
- [ ] Review status: ___________

### Google Play Store
- [ ] Google Play Console account created
- [ ] App created in Play Console
- [ ] Build uploaded
- [ ] Screenshots uploaded
- [ ] Description added
- [ ] Privacy policy URL added
- [ ] Support email added
- [ ] Pricing set
- [ ] Submitted for review
- [ ] Review status: ___________

## 📣 Phase 12: Launch

### Pre-Launch
- [ ] Social media posts prepared
- [ ] Press release written (optional)
- [ ] Vatican tourism sites contacted
- [ ] Launch date set
- [ ] Support system ready

### Launch Day
- [ ] App live on App Store
- [ ] App live on Google Play
- [ ] Social media announcement posted
- [ ] Website updated (if applicable)
- [ ] Monitoring for issues

### Post-Launch (First Week)
- [ ] Day 1: Monitor reviews
- [ ] Day 2: Respond to feedback
- [ ] Day 3: Check analytics
- [ ] Day 4: Fix any critical bugs
- [ ] Day 5: Plan first update
- [ ] Day 6: Gather user feedback
- [ ] Day 7: Review metrics

## 📊 Success Metrics

### Week 1 Goals
- [ ] ___ downloads
- [ ] ___ active users
- [ ] ___ tour completions
- [ ] ___+ star rating
- [ ] < 1% crash rate

### Month 1 Goals
- [ ] ___ downloads
- [ ] ___ active users
- [ ] ___ tour completions
- [ ] ___+ star rating
- [ ] Positive user feedback

## 🎉 Celebration

- [ ] App successfully launched!
- [ ] First user review received
- [ ] First 100 downloads
- [ ] First 1000 downloads
- [ ] Featured by Vatican tourism
- [ ] Positive press coverage
- [ ] Team celebration! 🎊

---

## Notes & Issues

Use this space to track issues and notes:

**Issues Found:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Improvements Needed:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**User Feedback:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Next Update Plans:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

**Launch Date**: _______________
**Version**: 1.0.0
**Status**: _______________

**Congratulations on your launch! 🚀🏛️**
