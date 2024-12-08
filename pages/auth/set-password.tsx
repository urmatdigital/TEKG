import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const telegram_id = searchParams.get('telegram_id');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Пароль должен содержать минимум 8 символов');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          telegram_id,
          password: formData.password
        })
      });

      if (!response.ok) {
        throw new Error('Failed to set password');
      }

      toast.success('Пароль успешно установлен!');
      router.push('/auth/login');
    } catch (error) {
      console.error('Set password error:', error);
      toast.error('Произошла ошибка при установке пароля');
    } finally {
      setLoading(false);
    }
  };

  if (!telegram_id) {
    return (
      <AuthLayout
        title="Ошибка"
        subtitle="Отсутствует идентификатор пользователя"
      >
        <div className="text-center">
          <p className="text-red-500">Неверная ссылка для установки пароля</p>
          <Button
            className="mt-4"
            onClick={() => router.push('/auth/login')}
          >
            Вернуться на страницу входа
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Установка пароля"
      subtitle="Создайте пароль для вашего аккаунта"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Пароль
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Минимум 8 символов"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Подтверждение пароля
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            placeholder="Повторите пароль"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Установить пароль'}
        </Button>
      </form>
    </AuthLayout>
  );
}
