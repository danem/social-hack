// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key'; // Replace with your actual key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
