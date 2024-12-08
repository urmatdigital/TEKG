'use client';

import React, { FC } from 'react';
import type { Database } from '@/types/database.types';
import { formatDate } from '@/utils/formatters';
import { ParcelStatusBadge } from './ParcelStatusBadge';

type Parcel = Database['public']['Tables']['parcels']['Row'];

interface ParcelsListProps {
  parcels: Parcel[];
  onParcelClick?: (parcel: Parcel) => void;
}

export const ParcelsList: FC<ParcelsListProps> = ({ parcels, onParcelClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Трек-номер
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Дата создания
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {parcels.map((parcel) => (
            <tr
              key={parcel.id}
              onClick={() => onParcelClick?.(parcel)}
              className={onParcelClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {parcel.tracking_code}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ParcelStatusBadge status={parcel.status || 'created'} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(parcel.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 