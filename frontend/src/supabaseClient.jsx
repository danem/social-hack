import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.REACT_APP_SUPA_URL, process.env.REACT_APP_ANON_API_KEY);

export default supabase;