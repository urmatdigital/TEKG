'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const phoneRegex = /^\+996\d{9}$/;

const formSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Введите корректный номер телефона в формате +996XXXXXXXXX'),
  code: z.string().min(4, 'Код должен содержать не менее 4 символов').optional(),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов').optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = React.useState<'phone' | 'code' | 'password'>('phone');
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
      code: '',
      password: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      if (step === 'phone') {
        const response = await fetch('/api/auth/send-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: values.phone }),
        });

        if (!response.ok) {
          throw new Error('Ошибка при отправке кода');
        }

        toast.success('Код подтверждения отправлен');
        setStep('code');
      } else if (step === 'code') {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: values.phone, code: values.code }),
        });

        if (!response.ok) {
          throw new Error('Неверный код подтверждения');
        }

        toast.success('Код подтвержден');
        setStep('password');
      } else if (step === 'password') {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Ошибка при регистрации');
        }

        toast.success('Регистрация успешна');
        router.push('/auth/login');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер телефона</FormLabel>
              <FormControl>
                <Input
                  placeholder="+996XXXXXXXXX"
                  {...field}
                  disabled={step !== 'phone'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {step !== 'phone' && (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Код подтверждения</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Введите код"
                    {...field}
                    disabled={step === 'password'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {step === 'password' && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Введите пароль"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : step === 'phone' ? 'Отправить код' : step === 'code' ? 'Подтвердить код' : 'Зарегистрироваться'}
        </Button>
      </form>
    </Form>
  );
}
