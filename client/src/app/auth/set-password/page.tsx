'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { useEffect } from 'react'

// Создаем клиент с сервисным ключом для админского доступа
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)

function SetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const source = searchParams.get('source')

  useEffect(() => {
    // Инициализируем Telegram WebApp если открыто из Telegram
    if (source === 'telegram' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
    }
  }, [source])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      setLoading(false)
      return
    }

    try {
      // Получаем профиль по коду авторизации
      const { data: profile, error: profileError } = await adminSupabase
        .from('profiles')
        .select('*')
        .eq('auth_code', code)
        .single()

      if (profileError || !profile) {
        throw new Error('Профиль не найден')
      }

      // Сначала входим с временным кодом
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${profile.telegram_id}@telegram.user`,
        password: code as string
      })

      if (signInError) throw signInError

      // Теперь обновляем пароль
      const { error: updateAuthError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateAuthError) throw updateAuthError

      // Сохраняем хеш пароля в профиле и очищаем код авторизации
      const { error: updateProfileError } = await adminSupabase
        .from('profiles')
        .update({
          password_hash: password,
          auth_code: null
        })
        .eq('id', profile.id)

      if (updateProfileError) throw updateProfileError

      router.push('/dashboard')
    } catch (error) {
      console.error('Set password error:', error)
      setError('Произошла ошибка при установке пароля')
      // Выходим из системы в случае ошибки
      await supabase.auth.signOut()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Установите пароль
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Придумайте надежный пароль для входа в систему
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Новый пароль
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Подтвердите пароль
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Сохранение...' : 'Сохранить пароль'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetPasswordContent />
    </Suspense>
  )
}