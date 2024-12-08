import type { NextApiRequest, NextApiResponse } from 'next';
import { createHash, createHmac } from 'crypto';
import { TelegramLoginData } from '@/lib/telegram/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body as TelegramLoginData;
    
    // Проверяем валидность данных от Telegram
    if (!isValidTelegramAuth(data)) {
      return res.status(400).json({ error: 'Invalid authentication data' });
    }

    // Отправляем запрос на наш сервер
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telegram_id: data.telegram_id,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        photo_url: data.photo_url
      }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Telegram auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function isValidTelegramAuth(data: TelegramLoginData): boolean {
  // Проверяем, что данные не старше 1 часа
  const authTimestamp = data.auth_date;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (currentTimestamp - authTimestamp > 3600) {
    return false;
  }

  // Проверяем hash от Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const secretKey = createHash('sha256')
    .update(botToken)
    .digest();

  const dataCheckString = Object.entries(data)
    .filter(([key]) => key !== 'hash')
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');

  const hash = createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return data.hash === hash;
} 