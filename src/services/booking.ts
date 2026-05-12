import Constants from 'expo-constants';

const PAYLOAD_BASE_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_PAYLOAD_BASE_URL ?? '';
const PAYLOAD_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_PAYLOAD_API_KEY ?? '';

export type Booking = {
  id: string;
  bookingId: string;
  tourId: string;
  tourTitle: string;
  userEmail: string;
  userName: string;
  bookingDate: string;
  tourDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  ticketCode: string;
  qrCode?: string;
  price: number;
  currency: string;
  participants: number;
};

export type Ticket = {
  id: string;
  bookingId: string;
  ticketCode: string;
  qrCode: string;
  tourId: string;
  tourTitle: string;
  tourDate: string;
  status: 'valid' | 'used' | 'expired' | 'cancelled';
  validatedAt?: string;
  userEmail: string;
};

const getFetchHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (PAYLOAD_API_KEY) {
    headers['Authorization'] = `Bearer ${PAYLOAD_API_KEY}`;
  }
  
  return headers;
};

/**
 * Fetch user's bookings from Payload CMS
 */
export const fetchUserBookings = async (userEmail: string): Promise<Booking[]> => {
  try {
    console.log('[Booking] Fetching bookings for:', userEmail);
    
    const url = `${PAYLOAD_BASE_URL}/api/bookings?where[userEmail][equals]=${encodeURIComponent(userEmail)}&sort=-createdAt`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getFetchHeaders(),
    });
    
    if (!response.ok) {
      console.error('[Booking] Fetch failed:', response.status, response.statusText);
      throw new Error(`Failed to fetch bookings: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`[Booking] Fetched ${data.docs?.length || 0} bookings`);
    
    return (data.docs || []).map((doc: any): Booking => ({
      id: doc.id,
      bookingId: doc.bookingId || doc.id,
      tourId: doc.tourId || doc.tour?.id || '',
      tourTitle: doc.tourTitle || doc.tour?.title || 'Unknown Tour',
      userEmail: doc.userEmail || '',
      userName: doc.userName || '',
      bookingDate: doc.createdAt || '',
      tourDate: doc.tourDate || '',
      status: doc.status || 'pending',
      ticketCode: doc.ticketCode || '',
      qrCode: doc.qrCode || '',
      price: doc.price || 0,
      currency: doc.currency || 'EUR',
      participants: doc.participants || 1,
    }));
  } catch (error) {
    console.error('[Booking] Error fetching bookings:', error);
    throw error;
  }
};

/**
 * Fetch user's tickets from Payload CMS
 */
export const fetchUserTickets = async (userEmail: string): Promise<Ticket[]> => {
  try {
    console.log('[Booking] Fetching tickets for:', userEmail);
    
    const url = `${PAYLOAD_BASE_URL}/api/tickets?where[userEmail][equals]=${encodeURIComponent(userEmail)}&sort=-createdAt`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getFetchHeaders(),
    });
    
    if (!response.ok) {
      console.error('[Booking] Tickets fetch failed:', response.status, response.statusText);
      throw new Error(`Failed to fetch tickets: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`[Booking] Fetched ${data.docs?.length || 0} tickets`);
    
    return (data.docs || []).map((doc: any): Ticket => ({
      id: doc.id,
      bookingId: doc.bookingId || doc.booking?.id || '',
      ticketCode: doc.ticketCode || '',
      qrCode: doc.qrCode || '',
      tourId: doc.tourId || doc.tour?.id || '',
      tourTitle: doc.tourTitle || doc.tour?.title || 'Unknown Tour',
      tourDate: doc.tourDate || '',
      status: doc.status || 'valid',
      validatedAt: doc.validatedAt || undefined,
      userEmail: doc.userEmail || '',
    }));
  } catch (error) {
    console.error('[Booking] Error fetching tickets:', error);
    throw error;
  }
};

/**
 * Validate a ticket by ticket code
 */
export const validateTicket = async (ticketCode: string): Promise<Ticket | null> => {
  try {
    console.log('[Booking] Validating ticket:', ticketCode);
    
    const url = `${PAYLOAD_BASE_URL}/api/tickets?where[ticketCode][equals]=${encodeURIComponent(ticketCode)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getFetchHeaders(),
    });
    
    if (!response.ok) {
      console.error('[Booking] Ticket validation failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (!data.docs || data.docs.length === 0) {
      console.log('[Booking] Ticket not found');
      return null;
    }
    
    const doc = data.docs[0];
    console.log('[Booking] Ticket found:', doc.status);
    
    return {
      id: doc.id,
      bookingId: doc.bookingId || doc.booking?.id || '',
      ticketCode: doc.ticketCode || '',
      qrCode: doc.qrCode || '',
      tourId: doc.tourId || doc.tour?.id || '',
      tourTitle: doc.tourTitle || doc.tour?.title || 'Unknown Tour',
      tourDate: doc.tourDate || '',
      status: doc.status || 'valid',
      validatedAt: doc.validatedAt || undefined,
      userEmail: doc.userEmail || '',
    };
  } catch (error) {
    console.error('[Booking] Error validating ticket:', error);
    return null;
  }
};

/**
 * Sync bookings from website to app
 * This should be called when user logs in or refreshes
 */
export const syncBookingsFromWebsite = async (userEmail: string): Promise<{
  bookings: Booking[];
  tickets: Ticket[];
}> => {
  try {
    console.log('[Booking] Syncing bookings from website for:', userEmail);
    
    const [bookings, tickets] = await Promise.all([
      fetchUserBookings(userEmail),
      fetchUserTickets(userEmail),
    ]);
    
    console.log(`[Booking] Synced ${bookings.length} bookings and ${tickets.length} tickets`);
    
    return { bookings, tickets };
  } catch (error) {
    console.error('[Booking] Error syncing bookings:', error);
    throw error;
  }
};

/**
 * Check if user has a valid ticket for a specific tour
 */
export const hasValidTicketForTour = async (
  userEmail: string,
  tourId: string
): Promise<boolean> => {
  try {
    const tickets = await fetchUserTickets(userEmail);
    const validTicket = tickets.find(
      (ticket) => ticket.tourId === tourId && ticket.status === 'valid'
    );
    return !!validTicket;
  } catch (error) {
    console.error('[Booking] Error checking ticket validity:', error);
    return false;
  }
};
