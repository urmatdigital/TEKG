'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';
import { supabase } from '@/lib/api/client';

export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const telegram_id = searchParams.get('telegram_id');
  const auth_code = searchParams.get('auth_code');

  // Проверяем auth_code при загрузке страницы
  useEffect(() => {
    const verifyAuthCode = async () => {
      if (!telegram_id || !auth_code) {
        toast.error('Отсутствуют необходимые параметры');
        router.replace('/auth');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            telegram_id,
            auth_code
          })
        });

        if (!response.ok) {
          throw new Error('Invalid auth code');
        }

        setVerified(true);
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Неверный код подтверждения');
        router.replace('/auth');
      }
    };

    verifyAuthCode();
  }, [telegram_id, auth_code, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verified) {
      toast.error('Пожалуйста, подождите подтверждения кода');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      setLoading(true);

      // 1. Устанавливаем пароль
      const setPasswordResponse = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          telegram_id,
          password: formData.password
        })
      });

      if (!setPasswordResponse.ok) {
        throw new Error('Failed to set password');
      }

      // 2. Получаем данные пользователя
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .eq('telegram_id', telegram_id)
        .single();

      if (userError) throw userError;

      // 3. Выполняем вход через Supabase Auth
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email || `${telegram_id}@te.kg`,
        password: formData.password
      });

      if (signInError) throw signInError;

      toast.success('Регистрация успешно завершена!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Set password error:', error);
      toast.error('Произошла ошибка при установке пароля');
    } finally {
      setLoading(false);
    }
  };

  if (!verified) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Проверка кода подтверждения...
          </h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Завершение регистрации
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Придумайте пароль
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              required
              minLength={6}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Подтвердите пароль
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                confirmPassword: e.target.value
              }))}
              required
              minLength={6}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            Зарегистрироваться
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
} 