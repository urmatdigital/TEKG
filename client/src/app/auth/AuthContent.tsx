'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaTelegram, FaPhone } from 'react-icons/fa'
import Image from 'next/image'

export default function AuthContent() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleTelegramLogin = () => {
    window.location.href = 'https://t.me/tekg_bot?start=auth'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Tulpar Express Logo"
            width={120}
            height={120}
            className="mb-8"
          />
        </div>
        <h2 className="text-center text-4xl font-extrabold text-gray-900 tracking-tight">
          Tulpar Express
        </h2>
        <p className="mt-4 text-center text-lg text-gray-600">
          Войдите в систему для отслеживания посылок
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100">
          <div className="space-y-6">
            <button
              onClick={handleTelegramLogin}
              disabled={loading}
              className="relative w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-[#0088cc] hover:bg-[#0077b5] focus:outline-none focus:ring-4 focus:ring-[#0088cc] focus:ring-opacity-50 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
            >
              <FaTelegram className="h-6 w-6" />
              <span>Войти через Telegram</span>
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 text-base">или</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/auth/login')}
              disabled={loading}
              className="relative w-full flex justify-center items-center gap-3 py-4 px-6 border border-gray-300 rounded-lg shadow-md text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
            >
              <FaPhone className="h-5 w-5 text-gray-500" />
              <span>Войти по номеру телефона</span>
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}