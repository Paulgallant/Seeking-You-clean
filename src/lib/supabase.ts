import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database
export type Profile = {
  id: string;
  username: string;
  account_type: 'personal' | 'business' | 'creator';
  created_at: string;
}

export type PaymentSettings = {
  id: string;
  user_id: string;
  payment_method: 'bank' | 'crypto';
  bank_account?: string;
  routing_number?: string;
  crypto_address?: string;
  created_at: string;
}

export type StreamSession = {
  id: string;
  user_id: string;
  duration: number;
  earnings: number;
  started_at: string;
  ended_at?: string;
}

export type Gift = {
  id: string;
  sender_id: string;
  receiver_id: string;
  gift_type: 'heart' | 'star' | 'diamond';
  amount: number;
  created_at: string;
}