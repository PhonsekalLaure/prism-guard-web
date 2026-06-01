import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const storageKey = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`;
const clientKey = '__prismGuardSupabaseBrowserClient';

const supabaseBrowserClient = globalThis[clientKey] ?? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey,
  },
});

globalThis[clientKey] = supabaseBrowserClient;

export default supabaseBrowserClient;
