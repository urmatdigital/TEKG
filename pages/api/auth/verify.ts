import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/api/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { telegram_id, auth_code } = req.body;

    if (!telegram_id || !auth_code) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Проверяем код
    const { data: user, error } = await supabase
      .from('users')
      .select()
      .eq('telegram_id', telegram_id)
      .eq('auth_code', auth_code)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid auth code' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 