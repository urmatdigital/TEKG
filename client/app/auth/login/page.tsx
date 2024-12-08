'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithTelegram } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleTelegramLogin = () => {
    window.location.href = 'https://t.me/tekg_bot?start=auth';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Войти в аккаунт
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Используйте Telegram для быстрого входа
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            onClick={handleTelegramLogin}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Загрузка...</span>
            ) : (
              <span>Войти через Telegram</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
