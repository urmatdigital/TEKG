import { supabase } from '../lib/supabase';

export async function generateClientCode(): Promise<string> {
  const { data: lastUser } = await supabase
    .from('users')
    .select('client_code')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let lastNumber = 0;
  if (lastUser?.client_code) {
    const match = lastUser.client_code.match(/\d+/);
    if (match) {
      lastNumber = parseInt(match[0], 10);
    }
  }

  const nextNumber = lastNumber + 1;
  return `TE-${nextNumber.toString().padStart(4, '0')}`;
}
