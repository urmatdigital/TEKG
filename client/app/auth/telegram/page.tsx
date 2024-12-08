'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function TelegramAuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      // Сохраняем токен
      localStorage.setItem('token', token)
      // Перенаправляем на главную
      router.push('/')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Выполняется вход...</h1>
        <p className="text-muted-foreground">Пожалуйста, подождите</p>
      </div>
    </div>
  )
} 