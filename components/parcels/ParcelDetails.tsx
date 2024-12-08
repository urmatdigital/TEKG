'use client';

import React, { FC } from 'react';
import type { Database } from '@/types/database.types';
import { formatDate, formatWeight, formatDimensions, formatStatus } from '@/utils/formatters';

type Parcel = Database['public']['Tables']['parcels']['Row'];

interface ParcelDetailsProps {
  parcel: Parcel;
}

export const ParcelDetails: FC<ParcelDetailsProps> = ({ parcel }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        Посылка #{parcel.tracking_code}
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Статус</p>
          <p className="font-medium">{formatStatus(parcel.status || 'created')}</p>
        </div>
        
        <div>
          <p className="text-gray-600">Вес</p>
          <p className="font-medium">{formatWeight(parcel.weight)}</p>
        </div>
        
        <div>
          <p className="text-gray-600">Размеры</p>
          <p className="font-medium">{formatDimensions(parcel.dimensions)}</p>
        </div>
        
        <div>
          <p className="text-gray-600">Дата создания</p>
          <p className="font-medium">{formatDate(parcel.created_at)}</p>
        </div>
        
        <div className="col-span-2">
          <p className="text-gray-600">Описание</p>
          <p className="font-medium">{parcel.description || '-'}</p>
        </div>
      </div>
    </div>
  );
}; 