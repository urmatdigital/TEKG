'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import type { Tables } from '@/types/database.types';
import { supabase } from '@/lib/api/client';

type NewParcel = Omit<Tables<'parcels'>, 'id' | 'created_at' | 'updated_at'>;

export default function NewParcelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [parcel, setParcel] = useState<Partial<NewParcel>>({
    tracking_code: '',
    description: '',
    weight: null,
    dimensions: null,
    status: 'created'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const newParcel: NewParcel = {
        ...parcel,
        user_id: userData.user.id,
        tracking_code: parcel.tracking_code || generateTrackingCode(),
        metadata: {}
      };

      const { error: insertError } = await supabase
        .from('parcels')
        .insert(newParcel);

      if (insertError) throw insertError;

      router.push('/parcels');
    } catch (err) {
      console.error('Error creating parcel:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании посылки');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setParcel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDimensionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParcel(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: parseFloat(value) || 0
      }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Создание новой посылки</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Трек-номер (опционально)
          </label>
          <input
            type="text"
            name="tracking_code"
            value={parcel.tracking_code}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Описание
          </label>
          <textarea
            name="description"
            value={parcel.description || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Вес (кг)
          </label>
          <input
            type="number"
            name="weight"
            value={parcel.weight || ''}
            onChange={handleChange}
            step="0.1"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Длина (см)
            </label>
            <input
              type="number"
              name="length"
              value={parcel.dimensions?.length || ''}
              onChange={handleDimensionsChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ширина (см)
            </label>
            <input
              type="number"
              name="width"
              value={parcel.dimensions?.width || ''}
              onChange={handleDimensionsChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Высота (см)
            </label>
            <input
              type="number"
              name="height"
              value={parcel.dimensions?.height || ''}
              onChange={handleDimensionsChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Создание...' : 'Создать посылку'}
          </button>
        </div>
      </form>
    </div>
  );
}

function generateTrackingCode(): string {
  const prefix = 'TE';
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}${randomPart}`;
} 