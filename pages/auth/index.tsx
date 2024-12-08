'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { TelegramLoginButton } from '@/components/auth/TelegramLoginButton';
import { Card } from '@/components/ui/Card';
import { toast } from '@/components/ui/Toast';

export default function AuthPage() {
  const router = useRouter();
  const [isWaitingForTelegram, setIsWaitingForTelegram] = useState(false);

  const handleStartTelegramChat = () => {
    setIsWaitingForTelegram(true);
    toast({
      title: "Telegram бот",
      description: "Перейдите в Telegram и следуйте инструкциям бота",
    });
  };

  return (
    <AuthLayout
      title="Добро пожаловать в Tulpar Express"
      subtitle="Войдите через Telegram для доступа к системе"
    >
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <TelegramLoginButton 
            onStartChat={handleStartTelegramChat}
            className="shadow-lg hover:shadow-xl transition-shadow"
          />
          
          {isWaitingForTelegram && (
            <div className="text-center space-y-3">
              <div className="animate-pulse text-sm text-gray-600">
                Ожидание подтверждения из Telegram...
              </div>
              <div className="text-xs text-gray-500">
                Перейдите в чат с ботом и следуйте инструкциям
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          Нажимая "Войти через Telegram", вы соглашаетесь с{' '}
          <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
            условиями использования
          </a>
        </div>
      </Card>
    </AuthLayout>
  );
} 