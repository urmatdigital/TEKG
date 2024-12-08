'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

interface TelegramLoginButtonProps {
  botName: string;
  onAuth: (user: any) => void;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: string;
  lang?: string;
  className?: string;
}

export function TelegramLoginButton({
  botName,
  onAuth,
  buttonSize = 'large',
  cornerRadius,
  requestAccess,
  lang = 'en',
  className
}: TelegramLoginButtonProps) {
  useEffect(() => {
    // @ts-ignore
    window.onTelegramAuth = (user: any) => {
      onAuth(user);
    };
  }, [onAuth]);

  return (
    <>
      <Script src="https://telegram.org/js/telegram-widget.js?22" strategy="lazyOnload" />
      <div
        className={className}
        data-telegram-login={botName}
        data-size={buttonSize}
        data-radius={cornerRadius}
        data-request-access={requestAccess}
        data-lang={lang}
        data-auth-url={`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`}
        data-onauth="onTelegramAuth(user)"
      />
    </>
  );
} 