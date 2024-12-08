import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-application-name': 'te.kg'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    timeout: 20000,
    params: {
      eventsPerSecond: 10
    }
  }
})

// Функция для повторных попыток с правильной типизацией
export async function withRetry<T>(
  operation: () => Promise<T> | T,
  maxRetries: number = 3,
  retryDelay: number = 2000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        console.log(`Retry attempt ${attempt + 1} of ${maxRetries}`);
      }
    }
  }

  throw lastError;
}

// Пример использования в компонентах:
// const data = await withRetry(() => 
//   supabase.from('profiles').select('*')
// );