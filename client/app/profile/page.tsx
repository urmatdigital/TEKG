'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                {user.photo_url ? (
                  <AvatarImage src={user.photo_url} alt={`${user.first_name} ${user.last_name}`} />
                ) : (
                  <AvatarFallback>{initials}</AvatarFallback>
                )}
              </Avatar>
              <h1 className="text-2xl font-bold mb-2">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-gray-600 mb-4">Код клиента: {user.client_code}</p>
              
              <div className="space-y-2 text-left">
                <p><span className="font-semibold">Телефон:</span> {user.phone}</p>
                {user.telegram_username && (
                  <p><span className="font-semibold">Telegram:</span> @{user.telegram_username}</p>
                )}
                <p><span className="font-semibold">Реферальный код:</span> {user.referral_code}</p>
                <p><span className="font-semibold">Бонусы:</span> {user.referral_bonus || 0} сом</p>
                {user.email && (
                  <p><span className="font-semibold">Email:</span> {user.email}</p>
                )}
                <p><span className="font-semibold">Статус аккаунта:</span> {user.verified ? 'Verified' : 'Not Verified'}</p>
                <p><span className="font-semibold">Дата регистрации:</span> {new Date(user.created_at).toLocaleDateString()}</p>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  Выйти
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
