'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Профиль пользователя</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Имя</label>
            <p className="mt-1 text-sm text-gray-900">{user.first_name || 'Не указано'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Фамилия</label>
            <p className="mt-1 text-sm text-gray-900">{user.last_name || 'Не указано'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Имя пользователя</label>
            <p className="mt-1 text-sm text-gray-900">{user.username || 'Не указано'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Телефон</label>
            <p className="mt-1 text-sm text-gray-900">{user.phone || 'Не указано'}</p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => signOut()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Выйти из системы
          </button>
        </div>
      </div>
    </div>
  );
}
