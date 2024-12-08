import { FC } from 'react';
import type { Database } from '@/types/database.types';

type ParcelStatus = 'created' | 'accepted' | 'in_warehouse' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'lost';

interface ParcelStatusBadgeProps {
  status: ParcelStatus;
}

export const ParcelStatusBadge: FC<ParcelStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: ParcelStatus): string => {
    const colors: Record<ParcelStatus, string> = {
      created: 'bg-gray-100 text-gray-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_warehouse: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      returned: 'bg-red-100 text-red-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: ParcelStatus): string => {
    const texts: Record<ParcelStatus, string> = {
      created: 'Создан',
      accepted: 'Принят',
      in_warehouse: 'На складе',
      in_transit: 'В пути',
      out_for_delivery: 'На доставке',
      delivered: 'Доставлен',
      returned: 'Возвращен',
      lost: 'Утерян'
    };
    return texts[status] || status;
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );
};