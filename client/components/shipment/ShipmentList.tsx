'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Package, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Shipment {
  id: string;
  trackingNumber: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  senderName: string;
  recipientName: string;
  createdAt: string;
  estimatedDelivery: string;
}

interface ShipmentListProps {
  shipments: Shipment[];
  isLoading?: boolean;
}

const getStatusInfo = (status: Shipment['status']) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Ожидает отправки',
        icon: Clock,
        className: 'bg-yellow-100 text-yellow-800',
      };
    case 'in_transit':
      return {
        label: 'В пути',
        icon: Package,
        className: 'bg-blue-100 text-blue-800',
      };
    case 'delivered':
      return {
        label: 'Доставлено',
        icon: CheckCircle2,
        className: 'bg-green-100 text-green-800',
      };
    case 'failed':
      return {
        label: 'Ошибка доставки',
        icon: AlertCircle,
        className: 'bg-red-100 text-red-800',
      };
    default:
      return {
        label: 'Неизвестно',
        icon: Package,
        className: 'bg-gray-100 text-gray-800',
      };
  }
};

export const ShipmentList: React.FC<ShipmentListProps> = ({
  shipments,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card animate-pulse rounded-lg border p-6"
          >
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Нет отправлений</h3>
        <p className="mt-2 text-muted-foreground">
          У вас пока нет созданных отправлений
        </p>
        <Link href="/shipments/new">
          <Button className="mt-4">Создать отправление</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shipments.map((shipment) => {
        const statusInfo = getStatusInfo(shipment.status);
        const StatusIcon = statusInfo.icon;

        return (
          <div
            key={shipment.id}
            className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${statusInfo.className}`}
                  >
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      Отправление {shipment.trackingNumber}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(shipment.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/tracking?number=${shipment.trackingNumber}`}
                  className="hidden sm:flex items-center text-sm text-primary hover:text-primary/80"
                >
                  Отследить
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Отправитель</p>
                  <p className="font-medium">{shipment.senderName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Получатель</p>
                  <p className="font-medium">{shipment.recipientName}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Ожидаемая дата доставки
                </p>
                <p className="font-medium">
                  {new Date(shipment.estimatedDelivery).toLocaleDateString(
                    'ru-RU',
                    {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }
                  )}
                </p>
              </div>

              <div className="mt-4 sm:hidden">
                <Link href={`/tracking?number=${shipment.trackingNumber}`}>
                  <Button className="w-full">Отследить</Button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
