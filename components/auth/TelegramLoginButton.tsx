'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface TelegramLoginButtonProps {
  className?: string;
  onStartChat: () => void;
}

export function TelegramLoginButton({ className, onStartChat }: TelegramLoginButtonProps) {
  const handleClick = async () => {
    try {
      // Открываем Telegram бота в новом окне
      const botUrl = 'https://t.me/TulparExpressBot?start=auth';
      const width = 600;
      const height = 600;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      window.open(
        botUrl,
        'telegram-auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      onStartChat();
    } catch (error) {
      console.error('Telegram error:', error);
    }
  };

  return (
    <Button
      variant="telegram"
      size="lg"
      fullWidth
      className={className}
      onClick={handleClick}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.38-.49 1.07-.74 4.2-1.82 7-3.03 8.4-3.61 4-.17 4.83 1.22 4.88 1.11z"/>
      </svg>
      Войти через Telegram
    </Button>
  );
} 