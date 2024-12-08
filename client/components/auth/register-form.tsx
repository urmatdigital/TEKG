'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTelegramCodeRequested, setIsTelegramCodeRequested] = useState(false);

  const handleTelegramCode = async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/auth/telegram-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при отправке кода');
      }

      setIsTelegramCodeRequested(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTelegramCodeRequested) {
      setError('Сначала запросите код в Telegram');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при регистрации');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-2">Регистрация аккаунта</h1>
      <p className="text-gray-600 text-center mb-8">
        Введите свой номер телефона для регистрации
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Номер телефона
          </label>
          <input
            type="tel"
            placeholder="+996XXXXXXXXX"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Пароль
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="button"
          onClick={handleTelegramCode}
          className="w-full bg-white text-blue-500 border border-blue-500 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          disabled={isLoading}
        >
          Получить код в Telegram
        </button>

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading || !isTelegramCodeRequested}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <div className="text-center mt-4">
          <span className="text-gray-600">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-blue-500 hover:text-blue-700">
              Войти
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
