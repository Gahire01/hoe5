import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Single instance — avoids the NavigatorLock collision that happens when
// multiple createClient() calls share the same localStorage key.
// Stored on import module cache (Vite/ESM guarantees one module instance).
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey:        'hoe_supabase_auth',   // unique key → no cross-project collision
    autoRefreshToken:  true,
    persistSession:    true,
    detectSessionInUrl: true,
  },
});
