import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/api/client';
import { hash } from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { telegram_id, password } = req.body;

    if (!telegram_id || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Хешируем пароль
    const hashedPassword = await hash(password, 10);

    // 2. Создаем пользователя в Supabase Auth
    const email = `${telegram_id}@te.kg`;
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) throw authError;

    // 3. Обновляем пользователя в базе данных
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password_hash: hashedPassword,
        auth_code: null, // Очищаем код после установки пароля
        id: authUser.user.id, // Связываем с пользователем Auth
        email
      })
      .eq('telegram_id', telegram_id);

    if (updateError) throw updateError;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Set password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 