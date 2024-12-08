'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'

export function Navbar() {
  const { theme, systemTheme } = useTheme()
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Предотвращаем гидратацию
  useEffect(() => {
    setMounted(true)
  }, [])

  // Определяем текущую тему
  const currentTheme = theme === 'system' ? systemTheme : theme

  // Пока не произошла гидратация, не показываем логотип
  if (!mounted) {
    return (
      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-transparent" />
            <span className="font-bold">TE.KG</span>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          {mounted && (
            <Image
              src="/logo.svg"
              alt="TE.KG"
              width={24}
              height={24}
              className={`h-6 w-auto ${currentTheme === 'dark' ? 'invert' : ''}`}
              priority
            />
          )}
          <span className="font-bold">TE.KG</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="font-medium text-sm hover:text-primary"
            >
              Личный кабинет
            </Link>
          ) : (
            <Link
              href="/login"
              className="font-medium text-sm hover:text-primary"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
} 