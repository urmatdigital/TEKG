'use client';

import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type ShipmentStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

interface Shipment {
  id: string;
  trackingNumber: string;
  status: ShipmentStatus;
  senderName: string;
  recipientName: string;
  createdAt: string;
  estimatedDelivery: string;
}

interface ShipmentListProps {
  shipments: Shipment[];
}

const statusLabels: Record<ShipmentStatus, { label: string; className: string }> = {
  pending: { label: 'Ожидает', className: 'bg-yellow-100 text-yellow-800' },
  in_transit: { label: 'В пути', className: 'bg-blue-100 text-blue-800' },
  delivered: { label: 'Доставлено', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Отменено', className: 'bg-red-100 text-red-800' },
};

export function ShipmentList({ shipments }: ShipmentListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Номер отслеживания</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Отправитель</TableHead>
            <TableHead>Получатель</TableHead>
            <TableHead>Дата создания</TableHead>
            <TableHead>Ожидаемая доставка</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.id}>
              <TableCell>
                <Link
                  href={`/shipments/${shipment.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {shipment.trackingNumber}
                </Link>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={statusLabels[shipment.status].className}
                >
                  {statusLabels[shipment.status].label}
                </Badge>
              </TableCell>
              <TableCell>{shipment.senderName}</TableCell>
              <TableCell>{shipment.recipientName}</TableCell>
              <TableCell>{formatDate(shipment.createdAt)}</TableCell>
              <TableCell>{formatDate(shipment.estimatedDelivery)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
