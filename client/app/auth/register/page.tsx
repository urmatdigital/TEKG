'use client';

import { RegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Регистрация
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Уже есть аккаунт?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Войти
            </Link>
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
