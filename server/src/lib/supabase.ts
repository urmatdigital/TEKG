import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

if (!config.supabase.url) throw new Error('Missing SUPABASE_URL');
if (!config.supabase.serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');

export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);