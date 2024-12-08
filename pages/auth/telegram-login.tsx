import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

const TelegramLoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { id } = router.query;

  useEffect(() => {
    const loginWithTelegram = async () => {
      try {
        if (!id) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/telegram/check-status?telegramId=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка авторизации');
        }

        const data = await response.json();
        
        if (data.needsPassword) {
          // Если пользователю нужно установить пароль, перенаправляем на страницу установки пароля
          router.push(`/auth/set-password?telegram_id=${id}`);
          return;
        }

        // Если пароль уже установлен, выполняем вход
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        login(data.user, data.token);
        router.push('/');
      } catch (error) {
        console.error('Ошибка при авторизации через Telegram:', error);
        router.push('/auth/login');
      }
    };

    if (id) {
      loginWithTelegram();
    }
  }, [id, router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Авторизация через Telegram
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Пожалуйста, подождите, идет авторизация...
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
};

export default TelegramLoginPage;
