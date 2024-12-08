import RegisterForm from '@/components/auth/register-form';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            TULPAR EXPRESS
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Войдите
            </Link>
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
