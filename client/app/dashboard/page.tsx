'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/atoms/Button';
import { Package, Truck, Clock, MapPin } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      id: 1,
      name: 'Активные отправления',
      value: '12',
      icon: Package,
      change: '+2.1%',
      changeType: 'positive',
    },
    {
      id: 2,
      name: 'В пути',
      value: '7',
      icon: Truck,
      change: '+1.2%',
      changeType: 'positive',
    },
    {
      id: 3,
      name: 'Среднее время доставки',
      value: '3.2 дня',
      icon: Clock,
      change: '-0.4%',
      changeType: 'negative',
    },
    {
      id: 4,
      name: 'Пункты выдачи',
      value: '24',
      icon: MapPin,
      change: '0%',
      changeType: 'neutral',
    },
  ];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Добро пожаловать, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Ваш код клиента: {user?.clientCode}
          </p>
        </div>
        <Button>Создать отправление</Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="p-6 bg-card rounded-lg border shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className="p-2 bg-background rounded-full">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-2">
              <span
                className={`text-sm ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : stat.changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-muted-foreground'
                }`}
              >
                {stat.change} за последний месяц
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Последние отправления */}
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Последние отправления</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                  Номер отправления
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                  Статус
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                  Дата отправления
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                  Получатель
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Здесь будут данные о последних отправлениях */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}