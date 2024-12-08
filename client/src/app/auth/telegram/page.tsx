'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers'
import type { TelegramAuthResponse } from '@/types/user'

export default function TelegramAuth() {
  const router = useRouter()
  const { signInWithTelegram } = useAuth()

  useEffect(() => {
    const handleTelegramAuth = async (response: TelegramAuthResponse) => {
      try {
        await signInWithTelegram(response)
        router.push('/dashboard')
      } catch (error) {
        console.error('Telegram auth error:', error)
        router.push('/login?error=telegram_auth_failed')
      }
    }

    window.onTelegramAuth = handleTelegramAuth

    return () => {
      delete window.onTelegramAuth
    }
  }, [router, signInWithTelegram])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Войти через Telegram</h2>
          <p className="mt-2 text-gray-600">
            Нажмите на кнопку ниже, чтобы войти через Telegram
          </p>
        </div>
        
        <div className="flex justify-center">
          <script
            async
            src="https://telegram.org/js/telegram-widget.js?22"
            data-telegram-login={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}
            data-size="large"
            data-radius="8"
            data-onauth="onTelegramAuth(user)"
            data-request-access="write"
          ></script>
        </div>
      </div>
    </div>
  )
} 