'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TrackingTimeline, ShipmentStatus } from '@/components/tracking/TrackingTimeline';

// Моковые данные для демонстрации
const mockTrackingData = {
  trackingNumber: 'TLP123456789',
  status: 'in_transit' as ShipmentStatus,
  events: [
    {
      id: '1',
      status: 'processing',
      location: 'Алматы, Казахстан',
      timestamp: '2024-12-07 10:30',
      description: 'Посылка принята в отделении',
    },
    {
      id: '2',
      status: 'in_transit',
      location: 'Астана, Казахстан',
      timestamp: '2024-12-07 14:45',
      description: 'Посылка отправлена в пункт назначения',
    },
    {
      id: '3',
      status: 'in_transit',
      location: 'Караганда, Казахстан',
      timestamp: '2024-12-07 18:20',
      description: 'Посылка в пути',
    },
  ],
};

interface SearchResult {
  trackingNumber: string;
  status: ShipmentStatus;
  events: {
    id: string;
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }[];
}

export default function TrackingPage() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (trackingNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // В реальном приложении здесь будет API запрос
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Имитация задержки
      setSearchResult(mockTrackingData as SearchResult);
    } catch (err) {
      setError('Не удалось найти информацию об отправлении');
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Отследить отправление</h1>
          <p className="text-muted-foreground">
            Введите номер отправления для получения актуальной информации о
            статусе доставки
          </p>
        </div>

        <div className="mb-8">
          <Input type="text" placeholder="Введите номер отправления" />
          <Button>Отследить</Button>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">Поиск отправления...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {searchResult && (
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Отправление {searchResult.trackingNumber}
              </h2>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {searchResult.status === 'processing'
                  ? 'В обработке'
                  : searchResult.status === 'in_transit'
                  ? 'В пути'
                  : searchResult.status === 'delivered'
                  ? 'Доставлено'
                  : 'В ожидании'}
              </div>
            </div>

            <TrackingTimeline
              events={searchResult.events}
              currentStatus={searchResult.status}
            />
          </div>
        )}
      </div>
    </div>
  );
}
