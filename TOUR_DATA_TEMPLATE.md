# Tour Data Template

Use this template to add your Vatican tour data. Copy and paste into `data/vatican-tours.ts`.

## Complete Tour Template

```typescript
{
  id: 'unique-tour-id',                    // Unique identifier (e.g., 'st-peters-basilica')
  name: 'Tour Name',                       // Display name
  description: 'Tour description...',      // 2-3 sentence description
  duration: 60,                            // Total duration in MINUTES
  coverImage: require('../assets/images/tours/cover.jpg'), // Tour cover image
  difficulty: 'easy',                      // 'easy' | 'moderate' | 'challenging'
  language: 'en',                          // Language code
  category: 'Religious Sites',             // Category name
  featured: true,                          // Show on home screen?
  downloadable: true,                      // Allow offline download?
  stops: [
    // Audio stops array (see below)
  ],
}
```

## Audio Stop Template

```typescript
{
  id: 'unique-stop-id',                    // Unique identifier
  tourId: 'unique-tour-id',                // Must match parent tour id
  name: 'Stop Name',                       // Display name
  description: 'Stop description...',      // 1-2 sentence description
  audioUrl: require('../assets/audio/file.mp3'), // Audio file path
  duration: 180,                           // Audio duration in SECONDS
  location: {
    latitude: 41.9022,                     // GPS latitude
    longitude: 12.4539,                    // GPS longitude
    address: 'Full address',               // Human-readable address
    floor: 'Ground Floor',                 // Optional: floor level
    room: 'Room 12',                       // Optional: room number
  },
  images: [
    require('../assets/images/stops/image1.jpg'),
    require('../assets/images/stops/image2.jpg'),
  ],
  order: 1,                                // Stop sequence number (1, 2, 3...)
  autoPlay: true,                          // GPS-triggered playback?
  radius: 50,                              // Trigger radius in METERS
}
```

## Example: St. Peter's Basilica Tour

```typescript
{
  id: 'st-peters-basilica',
  name: 'St. Peter\'s Basilica Tour',
  description: 'Explore the magnificent St. Peter\'s Basilica, one of the largest and most beautiful churches in the world. Discover its rich history, stunning architecture, and priceless artworks.',
  duration: 45,
  coverImage: require('../assets/images/tours/st-peters-cover.jpg'),
  difficulty: 'easy',
  language: 'en',
  category: 'Religious Sites',
  featured: true,
  downloadable: true,
  stops: [
    {
      id: 'st-peters-square',
      tourId: 'st-peters-basilica',
      name: 'St. Peter\'s Square',
      description: 'Welcome to St. Peter\'s Square, designed by the famous architect Gian Lorenzo Bernini in the 17th century.',
      audioUrl: require('../assets/audio/st-peters/01-square.mp3'),
      duration: 180,
      location: {
        latitude: 41.9022,
        longitude: 12.4539,
        address: 'Piazza San Pietro, Vatican City',
      },
      images: [
        require('../assets/images/stops/st-peters-square-1.jpg'),
        require('../assets/images/stops/st-peters-square-2.jpg'),
      ],
      order: 1,
      autoPlay: true,
      radius: 50,
    },
    {
      id: 'basilica-entrance',
      tourId: 'st-peters-basilica',
      name: 'The Basilica Entrance',
      description: 'Stand before the grand entrance to St. Peter\'s Basilica, with its massive bronze doors and stunning facade.',
      audioUrl: require('../assets/audio/st-peters/02-entrance.mp3'),
      duration: 240,
      location: {
        latitude: 41.9029,
        longitude: 12.4534,
        address: 'St. Peter\'s Basilica Entrance, Vatican City',
      },
      images: [
        require('../assets/images/stops/basilica-entrance.jpg'),
      ],
      order: 2,
      autoPlay: true,
      radius: 30,
    },
    {
      id: 'pieta',
      tourId: 'st-peters-basilica',
      name: 'Michelangelo\'s Pietà',
      description: 'Marvel at Michelangelo\'s masterpiece, the Pietà, created when he was just 24 years old.',
      audioUrl: require('../assets/audio/st-peters/03-pieta.mp3'),
      duration: 300,
      location: {
        latitude: 41.9028,
        longitude: 12.4533,
        address: 'St. Peter\'s Basilica, First Chapel on Right',
        floor: 'Ground Floor',
      },
      images: [
        require('../assets/images/stops/pieta-1.jpg'),
        require('../assets/images/stops/pieta-2.jpg'),
      ],
      order: 3,
      autoPlay: true,
      radius: 20,
    },
    {
      id: 'baldachin',
      tourId: 'st-peters-basilica',
      name: 'Bernini\'s Baldachin',
      description: 'Look up at the magnificent bronze baldachin, standing 29 meters tall over the papal altar.',
      audioUrl: require('../assets/audio/st-peters/04-baldachin.mp3'),
      duration: 270,
      location: {
        latitude: 41.9027,
        longitude: 12.4532,
        address: 'St. Peter\'s Basilica, Main Altar',
        floor: 'Ground Floor',
      },
      images: [
        require('../assets/images/stops/baldachin.jpg'),
      ],
      order: 4,
      autoPlay: true,
      radius: 25,
    },
    {
      id: 'dome',
      tourId: 'st-peters-basilica',
      name: 'The Dome',
      description: 'Gaze up at Michelangelo\'s magnificent dome, one of the largest in the world.',
      audioUrl: require('../assets/audio/st-peters/05-dome.mp3'),
      duration: 210,
      location: {
        latitude: 41.9026,
        longitude: 12.4531,
        address: 'St. Peter\'s Basilica, Under the Dome',
        floor: 'Ground Floor',
      },
      images: [
        require('../assets/images/stops/dome-interior.jpg'),
      ],
      order: 5,
      autoPlay: true,
      radius: 30,
    },
  ],
}
```

## Quick Reference

### Difficulty Levels
- `'easy'` - Flat terrain, short duration, accessible
- `'moderate'` - Some stairs, medium duration
- `'challenging'` - Many stairs, long duration, requires stamina

### Categories
- Religious Sites
- Museums
- Gardens
- Architecture
- History
- Art

### GPS Radius Guidelines
- **Outdoor open spaces**: 40-60 meters
- **Building entrances**: 25-35 meters
- **Indoor rooms**: 15-25 meters
- **Specific artworks**: 10-20 meters
- **Large halls**: 30-40 meters

### Audio Duration
- **Overview stops**: 2-3 minutes (120-180 seconds)
- **Detailed stops**: 4-5 minutes (240-300 seconds)
- **Major highlights**: 5-7 minutes (300-420 seconds)

### File Naming Conventions

**Audio files:**
```
assets/audio/
  ├── st-peters/
  │   ├── 01-square.mp3
  │   ├── 02-entrance.mp3
  │   └── 03-pieta.mp3
  ├── museums/
  │   ├── 01-entrance.mp3
  │   └── 02-sistine-chapel.mp3
  └── gardens/
      └── 01-overview.mp3
```

**Image files:**
```
assets/images/
  ├── tours/
  │   ├── st-peters-cover.jpg
  │   ├── museums-cover.jpg
  │   └── gardens-cover.jpg
  └── stops/
      ├── st-peters-square-1.jpg
      ├── st-peters-square-2.jpg
      └── pieta-1.jpg
```

## How to Get GPS Coordinates

### Method 1: Google Maps (Desktop)
1. Go to [Google Maps](https://maps.google.com)
2. Right-click on the exact location
3. Click the coordinates to copy them
4. Format: `41.9022, 12.4539`

### Method 2: Google Maps (Mobile)
1. Open Google Maps app
2. Long-press on the location
3. Coordinates appear at the top
4. Tap to copy

### Method 3: On-Site Collection
1. Visit the location
2. Use GPS app (e.g., "GPS Status" on Android)
3. Record coordinates at the exact spot
4. Note: GPS works best outdoors

## Testing Your Tours

### Checklist
- [ ] All audio files exist and play correctly
- [ ] All images load properly
- [ ] GPS coordinates are accurate
- [ ] Trigger radius is appropriate
- [ ] Stop order is correct
- [ ] Durations match actual audio length
- [ ] Descriptions are clear and engaging
- [ ] Tour difficulty is accurate

### Test Commands
```bash
# Install dependencies
yarn install

# Run on iOS
yarn dev:ios

# Run on Android
yarn dev:android

# Test on real device (recommended for GPS)
yarn dev
# Then scan QR code with Expo Go app
```

## Tips for Great Audio Tours

1. **Start with context** - Begin each stop with location orientation
2. **Tell stories** - People remember stories better than facts
3. **Keep it conversational** - Write like you're talking to a friend
4. **Vary the pace** - Mix shorter and longer stops
5. **Include directions** - Help users find the next stop
6. **End with a summary** - Recap key points at tour end

## Need Help?

- See `SETUP_GUIDE.md` for detailed setup instructions
- See `TRANSFORMATION_SUMMARY.md` for what's been changed
- Check console logs for error messages
- Test on real device for GPS features
