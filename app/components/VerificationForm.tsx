'use client'

import { useState } from 'react'

export default function VerificationForm({ phone }: { phone: string }) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, token }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      // Перенаправление после успешной верификации
      window.location.href = '/dashboard' // или куда вам нужно
    } catch (err: any) {
      setError(err?.message || 'Произошла ошибка при верификации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold">Введите код подтверждения</h2>
      <p className="text-gray-600">Код был отправлен на номер {phone}</p>
      
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Введите код"
        required
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
      />

      {error && (
        <p className="text-red-500">{error}</p>
      )}
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Проверка...' : 'Подтвердить'}
      </button>
    </form>
  )
} 