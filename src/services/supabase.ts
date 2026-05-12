import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Only create Supabase client if credentials are provided
// Otherwise, create a mock client to prevent crashes
const createSupabaseClient = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[Supabase] No credentials provided. Supabase features will be disabled.');
    // Return a mock client that won't crash the app
    return null;
  }
  
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
};

export const supabase = createSupabaseClient();

export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

/**
 * Sign up a new user
 */
export const signUp = async (email: string, password: string, name?: string) => {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized');
    return null;
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[Supabase] Sign up error:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized');
    return null;
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[Supabase] Sign in error:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized');
    return;
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('[Supabase] Sign out error:', error);
    throw error;
  }
};

/**
 * Get the current user session
 */
export const getSession = async () => {
  if (!supabase) {
    return null;
  }
  
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('[Supabase] Get session error:', error);
    return null;
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = async () => {
  if (!supabase) {
    return null;
  }
  
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('[Supabase] Get user error:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (updates: Partial<UserProfile>) => {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized');
    return null;
  }
  
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[Supabase] Update profile error:', error);
    throw error;
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId?: string): Promise<UserProfile | null> => {
  if (!supabase) {
    return null;
  }
  
  try {
    const user = userId ? { id: userId } : await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[Supabase] Get profile error:', error);
    return null;
  }
};

/**
 * Store user's booking/ticket data in Supabase
 */
export const storeUserTicket = async (ticketData: {
  booking_id: string;
  ticket_code: string;
  tour_id: string;
  tour_title: string;
  tour_date: string;
  status: string;
  qr_code?: string;
}) => {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized');
    return null;
  }
  
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('user_tickets')
      .insert({
        user_id: user.id,
        user_email: user.email,
        ...ticketData,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[Supabase] Store ticket error:', error);
    throw error;
  }
};

/**
 * Get user's tickets from Supabase
 */
export const getUserTickets = async () => {
  if (!supabase) {
    return [];
  }
  
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('[Supabase] Get tickets error:', error);
    return [];
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  if (!supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  
  return supabase.auth.onAuthStateChange(callback);
};
