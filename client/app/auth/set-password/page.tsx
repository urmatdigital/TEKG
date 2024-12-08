'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setPassword } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const phoneParam = searchParams.get('phone');
    if (phoneParam) {
      setPhone(phoneParam);
    } else {
      router.push('/auth/login');
    }
  }, [searchParams, router]);

  const formatPhoneNumber = (phone: string) => {
    // Форматирование номера телефона в виде +996 XXX XXX XXX
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{3})$/);
    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    return phone;
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Пароль должен содержать хотя бы одну заглавную букву');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setError('Пароль должен содержать хотя бы одну строчную букву');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError('Пароль должен содержать хотя бы одну цифру');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword()) {
      return;
    }

    try {
      setLoading(true);
      await setPassword(phone, password);
      router.push('/auth/login?success=password-set');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при установке пароля');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Установка пароля
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Создайте надежный пароль для входа в систему
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ваш номер телефона
              </label>
              <div className="mt-1">
                <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-700 sm:text-sm">
                  {formatPhoneNumber(phone)}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Этот номер телефона будет использоваться для входа в систему
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Минимум 8 символов"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Подтверждение пароля
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Повторите пароль"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="text-sm">
                <p className="font-medium text-gray-700">Требования к паролю:</p>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  <li>Минимум 8 символов</li>
                  <li>Хотя бы одна заглавная буква</li>
                  <li>Хотя бы одна строчная буква</li>
                  <li>Хотя бы одна цифра</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Сохранение...' : 'Сохранить пароль'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
