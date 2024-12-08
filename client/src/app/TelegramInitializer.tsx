'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { autoLoginWithTelegram } from '@/utils/telegram'

export default function TelegramInitializer() {
  const router = useRouter()

  useEffect(() => {
    const checkTelegramAuth = async () => {
      if (window.Telegram?.WebApp) {
        const session = await autoLoginWithTelegram(supabase)
        if (session) {
          router.push('/dashboard')
        }
      }
    }

    checkTelegramAuth()
  }, [router])

  return (
    <Script 
      src="https://telegram.org/js/telegram-web-app.js" 
      strategy="beforeInteractive"
      onLoad={() => {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.ready()
          window.Telegram.WebApp.expand()
        }
      }}
    />
  )
} 