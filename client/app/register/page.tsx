'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const registerSchema = z.object({
  phone: z.string().regex(/^\+996\d{9}$/, 'Телефон должен быть в формате +996XXXXXXXXX'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов')
    .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
});

const verifySchema = z.object({
  code: z.string().length(6, 'Код должен содержать 6 цифр')
});

type RegisterForm = z.infer<typeof registerSchema>;
type VerifyForm = z.infer<typeof verifySchema>;

export default function RegisterPage() {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: '',
      password: ''
    }
  });

  const verifyForm = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ''
    }
  });

  const handleRegister = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при регистрации');
      }

      setStep('verify');
      toast.success('Введите код подтверждения из Telegram');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (data: VerifyForm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: form.getValues('phone'),
          code: data.code
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при верификации');
      }

      toast.success('Регистрация успешно завершена');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramAuth = () => {
    const phone = form.getValues('phone');
    if (!phone) {
      toast.error('Введите номер телефона');
      return;
    }
    
    // Открываем Telegram бота
    const sessionId = Math.random().toString(36).substring(7);
    window.open(`https://t.me/tekg_bot?start=${sessionId}`, '_blank');
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/">te.kg</Link>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Регистрация аккаунта
            </h1>
            <p className="text-sm text-muted-foreground">
              Введите свой номер телефона для регистрации
            </p>
          </div>

          {step === 'register' ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Номер телефона</FormLabel>
                      <FormControl>
                        <Input placeholder="+996XXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col space-y-2">
                  <Button type="button" variant="outline" onClick={handleTelegramAuth}>
                    Получить код в Telegram
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Подождите...' : 'Зарегистрироваться'}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...verifyForm}>
              <form onSubmit={verifyForm.handleSubmit(handleVerify)} className="space-y-4">
                <FormField
                  control={verifyForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Код подтверждения</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите код из Telegram" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Проверка...' : 'Подтвердить'}
                </Button>
              </form>
            </Form>
          )}

          <p className="px-8 text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
