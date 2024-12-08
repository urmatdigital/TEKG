'use client';

import { useAuth } from '@/hooks/useAuth';
import type { AuthContextType } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          {user.telegramPhotoUrl && (
            <img
              src={user.telegramPhotoUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            {user.telegramUsername && (
              <p className="text-gray-600">@{user.telegramUsername}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Баланс</h2>
            <p className="text-gray-600">{user.balance} сом</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Реферальный баланс</h2>
            <p className="text-gray-600">{user.referralBalance} сом</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Кэшбэк баланс</h2>
            <p className="text-gray-600">{user.cashbackBalance} сом</p>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={() => {
              logout();
              router.push('/auth/login');
            }}
            variant="destructive"
            className="w-full"
          >
            Выйти
          </Button>
        </div>
      </Card>
    </div>
  );
}
