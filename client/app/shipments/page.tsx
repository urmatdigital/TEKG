'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ShipmentList } from '@/components/shipment/ShipmentList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Моковые данные для демонстрации
const mockShipments = [
  {
    id: '1',
    trackingNumber: 'TLP123456789',
    status: 'in_transit' as const,
    senderName: 'Иван Иванов',
    recipientName: 'Петр Петров',
    createdAt: '2024-12-07T10:30:00Z',
    estimatedDelivery: '2024-12-10T14:00:00Z',
  },
  {
    id: '2',
    trackingNumber: 'TLP987654321',
    status: 'pending' as const,
    senderName: 'Анна Сидорова',
    recipientName: 'Мария Козлова',
    createdAt: '2024-12-07T09:15:00Z',
    estimatedDelivery: '2024-12-09T16:00:00Z',
  },
  {
    id: '3',
    trackingNumber: 'TLP456789123',
    status: 'delivered' as const,
    senderName: 'Сергей Николаев',
    recipientName: 'Дмитрий Васильев',
    createdAt: '2024-12-06T15:45:00Z',
    estimatedDelivery: '2024-12-08T12:00:00Z',
  },
];

export default function ShipmentsPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = React.useState(mockShipments);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchShipments = async () => {
      try {
        // В реальном приложении здесь будет API запрос
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShipments(mockShipments);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить список отправлений');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, []);

  if (!user) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground">
            Пожалуйста, войдите в систему для просмотра отправлений
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Мои отправления</h1>
            <p className="text-muted-foreground">
              Управляйте вашими отправлениями и отслеживайте их статус
            </p>
          </div>
          <Link href="/shipments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Новое отправление
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        <ShipmentList shipments={shipments} isLoading={isLoading} />
      </div>
    </div>
  );
}
