import { Request, Response } from 'express';
import { verifyCode } from '../lib/telegram';
import { supabase } from '../lib/supabaseServer';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const verification = verifyCode(code);
  
  if (!verification.isValid) {
    return res.status(400).json({ error: 'Invalid code' });
  }

  try {
    // Создаем или обновляем пользователя в Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        phone: verification.phone,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    return res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Error verifying telegram code:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
