'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import type { TelegramSession } from '@/types/auth.types'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginWithTelegram } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const telegramData = {
          telegramId: searchParams.get('id'),
          firstName: searchParams.get('first_name'),
          lastName: searchParams.get('last_name'),
          username: searchParams.get('username'),
          photoUrl: searchParams.get('photo_url'),
          chatId: searchParams.get('chat_id'),
        } as TelegramSession;

        if (!telegramData.telegramId || !telegramData.firstName) {
          throw new Error('Invalid Telegram data');
        }

        await loginWithTelegram(telegramData);
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to authenticate');
        setTimeout(() => router.push('/auth/login'), 3000);
      }
    };

    handleCallback();
  }, [loginWithTelegram, router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}