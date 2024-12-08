'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ShipmentForm } from '@/components/shipment/ShipmentForm';

export default function NewShipmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const handleCreateShipment = async (formData: any) => {
    try {
      // В реальном приложении здесь будет API запрос
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // После успешного создания отправления перенаправляем на страницу отслеживания
      router.push('/tracking');
    } catch (err) {
      setError('Не удалось создать отправление. Пожалуйста, попробуйте позже.');
    }
  };

  if (!user) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground">
            Пожалуйста, войдите в систему для создания отправления
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Создание нового отправления</h1>
          <p className="text-muted-foreground">
            Заполните информацию об отправителе, получателе и грузе
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <ShipmentForm onSubmit={handleCreateShipment} />
        </div>
      </div>
    </div>
  );
}
