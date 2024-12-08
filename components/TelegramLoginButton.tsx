import React from 'react';
import Image from 'next/image';

interface TelegramLoginButtonProps {
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  className = '',
  onSuccess,
  onError,
}) => {
  const handleTelegramLogin = async () => {
    try {
      const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
      if (!botUsername) {
        throw new Error('Telegram bot username is not configured');
      }

      // Генерируем случайную строку для auth_date
      const authDate = Math.floor(Date.now() / 1000).toString();
      
      // URL для авторизации через Telegram
      const telegramAuthUrl = `https://telegram.me/${botUsername}?start=auth_${authDate}`;
      
      // Открываем URL в новом окне
      window.location.href = telegramAuthUrl;
      
      onSuccess?.();
    } catch (error) {
      console.error('Error during Telegram login:', error);
      onError?.(error as Error);
    }
  };

  return (
    <button
      onClick={handleTelegramLogin}
      className={`flex items-center justify-center space-x-2 px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b5] transition-colors duration-200 ${className}`}
    >
      <Image
        src="/telegram-logo.svg"
        alt="Telegram Logo"
        width={24}
        height={24}
        className="w-6 h-6"
      />
      <span>Войти через Telegram</span>
    </button>
  );
};

export default TelegramLoginButton;
