# 🎫 Website → App Booking Sync Guide

## Overview

This guide explains how bookings made on **wondersofrome.com** automatically appear in the mobile app.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    BOOKING FLOW                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User Books on Website                                        │
│     wondersofrome.com/book                                       │
│            │                                                      │
│            ▼                                                      │
│  2. Booking Saved to Payload CMS                                 │
│     POST /api/bookings                                           │
│     {                                                             │
│       userEmail: "user@example.com",                             │
│       tourId: "vatican-museums",                                 │
│       tourTitle: "Vatican Museums Tour",                         │
│       tourDate: "2026-05-15",                                    │
│       ticketCode: "VT-2026-ABC123",                              │
│       qrCode: "data:image/png;base64...",                        │
│       status: "confirmed",                                       │
│       price: 45,                                                 │
│       currency: "EUR"                                            │
│     }                                                             │
│            │                                                      │
│            ▼                                                      │
│  3. User Opens Mobile App                                        │
│     - Downloads app                                              │
│     - Signs up/logs in with SAME email                           │
│            │                                                      │
│            ▼                                                      │
│  4. App Syncs Bookings                                           │
│     syncBookingsFromWebsite(userEmail)                           │
│            │                                                      │
│            ▼                                                      │
│  5. Fetch from Payload                                           │
│     GET /api/bookings?where[userEmail][equals]=user@example.com  │
│     GET /api/tickets?where[userEmail][equals]=user@example.com   │
│            │                                                      │
│            ▼                                                      │
│  6. Cache in Supabase                                            │
│     storeUserTicket(ticketData)                                  │
│     → Stored in user_tickets table                               │
│            │                                                      │
│            ▼                                                      │
│  7. Display in App                                               │
│     "My Tickets" screen shows:                                   │
│     - Ticket QR code                                             │
│     - Tour details                                               │
│     - Booking status                                             │
│     - Tour date/time                                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation

### 1. Payload CMS Collections

#### Bookings Collection
```typescript
{
  slug: 'bookings',
  fields: [
    { name: 'bookingId', type: 'text', required: true, unique: true },
    { name: 'userEmail', type: 'email', required: true, index: true },
    { name: 'userName', type: 'text' },
    { name: 'tourId', type: 'text', required: true },
    { name: 'tourTitle', type: 'text', required: true },
    { name: 'tourDate', type: 'date', required: true },
    { name: 'status', type: 'select', options: ['pending', 'confirmed', 'cancelled', 'completed'] },
    { name: 'ticketCode', type: 'text', unique: true },
    { name: 'qrCode', type: 'textarea' }, // Base64 QR code image
    { name: 'price', type: 'number' },
    { name: 'currency', type: 'text', defaultValue: 'EUR' },
    { name: 'participants', type: 'number', defaultValue: 1 },
  ]
}
```

#### Tickets Collection
```typescript
{
  slug: 'tickets',
  fields: [
    { name: 'ticketCode', type: 'text', required: true, unique: true, index: true },
    { name: 'qrCode', type: 'textarea', required: true },
    { name: 'bookingId', type: 'relationship', relationTo: 'bookings' },
    { name: 'tourId', type: 'text', required: true },
    { name: 'tourTitle', type: 'text', required: true },
    { name: 'tourDate', type: 'date', required: true },
    { name: 'userEmail', type: 'email', required: true, index: true },
    { name: 'status', type: 'select', options: ['valid', 'used', 'expired', 'cancelled'] },
    { name: 'validatedAt', type: 'date' },
  ]
}
```

### 2. Website Booking Creation

When user completes booking on website:

```typescript
// website/api/bookings/create.ts
import { getPayloadClient } from './payload';

export async function createBooking(bookingData) {
  const payload = await getPayloadClient();
  
  // Generate unique ticket code
  const ticketCode = `VT-${new Date().getFullYear()}-${generateRandomCode()}`;
  
  // Generate QR code
  const qrCode = await generateQRCode(ticketCode);
  
  // Create booking in Payload
  const booking = await payload.create({
    collection: 'bookings',
    data: {
      bookingId: generateBookingId(),
      userEmail: bookingData.email,
      userName: bookingData.name,
      tourId: bookingData.tourId,
      tourTitle: bookingData.tourTitle,
      tourDate: bookingData.tourDate,
      status: 'confirmed',
      ticketCode,
      qrCode,
      price: bookingData.price,
      currency: 'EUR',
      participants: bookingData.participants,
    },
  });
  
  // Create ticket
  await payload.create({
    collection: 'tickets',
    data: {
      ticketCode,
      qrCode,
      bookingId: booking.id,
      tourId: bookingData.tourId,
      tourTitle: bookingData.tourTitle,
      tourDate: bookingData.tourDate,
      userEmail: bookingData.email,
      status: 'valid',
    },
  });
  
  // Send confirmation email
  await sendBookingConfirmation(bookingData.email, booking);
  
  return booking;
}
```

### 3. App Sync Implementation

#### On User Login
```typescript
// app/screens/LoginScreen.tsx
import { signIn } from '../src/services/supabase';
import { syncBookingsFromWebsite } from '../src/services/booking';

async function handleLogin(email: string, password: string) {
  try {
    // 1. Authenticate with Supabase
    const { user } = await signIn(email, password);
    
    // 2. Sync bookings from website
    const { bookings, tickets } = await syncBookingsFromWebsite(email);
    
    console.log(`Synced ${bookings.length} bookings and ${tickets.length} tickets`);
    
    // 3. Navigate to home
    navigation.navigate('Home');
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

#### Manual Refresh
```typescript
// app/screens/MyTicketsScreen.tsx
import { syncBookingsFromWebsite } from '../src/services/booking';
import { getCurrentUser } from '../src/services/supabase';

async function refreshTickets() {
  try {
    setRefreshing(true);
    
    const user = await getCurrentUser();
    if (!user?.email) return;
    
    const { bookings, tickets } = await syncBookingsFromWebsite(user.email);
    
    setBookings(bookings);
    setTickets(tickets);
  } catch (error) {
    console.error('Refresh failed:', error);
  } finally {
    setRefreshing(false);
  }
}
```

### 4. Supabase Schema

#### User Tickets Table
```sql
CREATE TABLE user_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  booking_id TEXT NOT NULL,
  ticket_code TEXT UNIQUE NOT NULL,
  qr_code TEXT NOT NULL,
  tour_id TEXT NOT NULL,
  tour_title TEXT NOT NULL,
  tour_date TIMESTAMP NOT NULL,
  status TEXT NOT NULL DEFAULT 'valid',
  validated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_user_tickets_user_id ON user_tickets(user_id);
CREATE INDEX idx_user_tickets_email ON user_tickets(user_email);
CREATE INDEX idx_user_tickets_code ON user_tickets(ticket_code);

-- Row Level Security
ALTER TABLE user_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets"
  ON user_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tickets"
  ON user_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Usage Examples

### Check if User Has Ticket for Tour
```typescript
import { hasValidTicketForTour } from './src/services/booking';

const canAccessTour = await hasValidTicketForTour(
  'user@example.com',
  'vatican-museums'
);

if (canAccessTour) {
  // Allow access to tour audio
  navigation.navigate('TourPlayer', { tourId: 'vatican-museums' });
} else {
  // Show booking prompt
  navigation.navigate('BookTour', { tourId: 'vatican-museums' });
}
```

### Validate Ticket at Entry
```typescript
import { validateTicket } from './src/services/booking';

async function scanTicket(qrCodeData: string) {
  const ticket = await validateTicket(qrCodeData);
  
  if (!ticket) {
    Alert.alert('Invalid Ticket', 'This ticket code is not valid.');
    return;
  }
  
  if (ticket.status === 'used') {
    Alert.alert('Already Used', 'This ticket has already been validated.');
    return;
  }
  
  if (ticket.status === 'expired') {
    Alert.alert('Expired', 'This ticket has expired.');
    return;
  }
  
  // Mark as used
  await markTicketAsUsed(ticket.id);
  
  Alert.alert('Valid Ticket', `Welcome to ${ticket.tourTitle}!`);
}
```

### Display Tickets in App
```typescript
// app/screens/MyTicketsScreen.tsx
import { getUserTickets } from '../src/services/supabase';
import QRCode from 'react-native-qrcode-svg';

export function MyTicketsScreen() {
  const [tickets, setTickets] = useState([]);
  
  useEffect(() => {
    loadTickets();
  }, []);
  
  async function loadTickets() {
    const userTickets = await getUserTickets();
    setTickets(userTickets);
  }
  
  return (
    <ScrollView>
      {tickets.map(ticket => (
        <View key={ticket.id} style={styles.ticketCard}>
          <Text style={styles.tourTitle}>{ticket.tour_title}</Text>
          <Text style={styles.tourDate}>
            {new Date(ticket.tour_date).toLocaleDateString()}
          </Text>
          
          <QRCode
            value={ticket.ticket_code}
            size={200}
          />
          
          <Text style={styles.ticketCode}>{ticket.ticket_code}</Text>
          
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {ticket.status.toUpperCase()}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
```

## Testing

### 1. Create Test Booking in Payload

```bash
curl -X POST https://admin.wondersofrome.com/api/bookings \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "TEST-001",
    "userEmail": "test@example.com",
    "userName": "Test User",
    "tourId": "vatican-museums",
    "tourTitle": "Vatican Museums Tour",
    "tourDate": "2026-05-15T10:00:00Z",
    "status": "confirmed",
    "ticketCode": "VT-2026-TEST001",
    "qrCode": "VT-2026-TEST001",
    "price": 45,
    "currency": "EUR",
    "participants": 1
  }'
```

### 2. Test Sync in App

```typescript
// In app console or test screen
import { syncBookingsFromWebsite } from './src/services/booking';

const result = await syncBookingsFromWebsite('test@example.com');
console.log('Bookings:', result.bookings);
console.log('Tickets:', result.tickets);
```

### 3. Verify in Supabase

Check the `user_tickets` table in Supabase dashboard to see cached tickets.

## Security Considerations

### API Key Protection
- Payload API key stored in `.env`
- Never exposed to client
- Read-only access to user's own bookings

### Email Verification
- Users can only see bookings for their email
- Payload filters by `userEmail` field
- Row-level security in Supabase

### Ticket Validation
- Ticket codes are unique and random
- QR codes contain encrypted data
- Status tracked (valid/used/expired)

## Troubleshooting

### Bookings Not Syncing
1. Check user email matches booking email exactly
2. Verify Payload API key is correct
3. Check network connectivity
4. Look for errors in console logs

### Tickets Not Appearing
1. Ensure booking has `status: 'confirmed'`
2. Check ticket was created in Payload
3. Verify Supabase connection
4. Check user is logged in

### QR Code Not Scanning
1. Ensure QR code data is valid
2. Check image format (base64 or URL)
3. Test with QR scanner app
4. Verify ticket code format

## Future Enhancements

- [ ] Push notifications when booking confirmed
- [ ] Automatic sync on app open
- [ ] Offline ticket validation
- [ ] Ticket transfer between users
- [ ] Family/group ticket management
- [ ] Refund/cancellation in app

---

**Last Updated**: May 8, 2026
