'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, Package, Truck } from 'lucide-react';

export type ShipmentStatus = 'pending' | 'processing' | 'in_transit' | 'delivered' | 'cancelled';

interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

interface TrackingTimelineProps {
  trackingNumber: string;
  status: ShipmentStatus;
  events: TrackingEvent[];
}

const statusConfig: Record<ShipmentStatus, { icon: React.ElementType; label: string; color: string }> = {
  pending: { icon: Clock, label: 'Ожидает обработки', color: 'text-yellow-500' },
  processing: { icon: Package, label: 'Обработка', color: 'text-blue-500' },
  in_transit: { icon: Truck, label: 'В пути', color: 'text-blue-500' },
  delivered: { icon: CheckCircle2, label: 'Доставлено', color: 'text-green-500' },
  cancelled: { icon: Circle, label: 'Отменено', color: 'text-red-500' },
};

export function TrackingTimeline({ trackingNumber, status, events }: TrackingTimelineProps) {
  const StatusIcon = statusConfig[status]?.icon || Circle;

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <StatusIcon className={cn('h-8 w-8', statusConfig[status]?.color)} />
        <div>
          <h3 className="text-lg font-medium">Отправление {trackingNumber}</h3>
          <p className={cn('text-sm', statusConfig[status]?.color)}>
            {statusConfig[status]?.label}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={event.id} className="relative">
            {index !== events.length - 1 && (
              <div className="absolute left-4 top-8 h-full w-0.5 bg-gray-200" />
            )}
            <div className="flex items-start space-x-4">
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                <Circle className="h-3 w-3 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{event.description}</p>
                  <time className="text-sm text-gray-500">{event.timestamp}</time>
                </div>
                <p className="mt-1 text-sm text-gray-500">{event.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
