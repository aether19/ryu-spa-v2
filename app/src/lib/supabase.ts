import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Booking {
  id?: string;
  service: string;
  location: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes?: string;
  stripePaymentId?: string;
  totalPrice?: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
}
