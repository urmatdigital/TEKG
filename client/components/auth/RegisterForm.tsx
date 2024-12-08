import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

export default function RegisterForm() {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const router = useRouter();

  const handleTelegramAuth = async () => {
    if (!phone) {
      setError('Введите номер телефона');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Открываем Telegram бота с параметром start
      const sessionId = Math.random().toString(36).substring(7);
      window.open(`https://t.me/tekg_bot?start=${sessionId}`, '_blank');
      
      // Отправляем запрос на регистрацию
      const formData = new FormData();
      formData.append('phone', phone);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при регистрации');
      }

      setShowCodeInput(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      setError('Введите код подтверждения');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('phone', phone);
      formData.append('code', verificationCode);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при проверке кода');
      }

      // Перенаправляем в дашборд после успешной верификации
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Регистрация</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Введите номер телефона для регистрации
        </p>
      </div>
      
      <form onSubmit={handleVerifyCode} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Номер телефона</Label>
          <Input
            id="phone"
            placeholder="+7XXXXXXXXXX"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {!showCodeInput ? (
          <Button
            type="button"
            className="w-full"
            onClick={handleTelegramAuth}
            disabled={loading}
          >
            {loading ? 'Подождите...' : 'Получить код в Telegram'}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Код подтверждения</Label>
              <Input
                id="code"
                placeholder="Введите код из Telegram"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Проверка...' : 'Подтвердить'}
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            {error}
          </Alert>
        )}
      </form>
    </div>
  );
}
