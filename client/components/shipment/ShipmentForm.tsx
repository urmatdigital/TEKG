'use client';

import React from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

interface ShipmentFormData {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  description: string;
}

interface ShipmentFormProps {
  onSubmit: (data: ShipmentFormData) => Promise<void>;
}

export const ShipmentForm: React.FC<ShipmentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState<ShipmentFormData>({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    description: '',
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ShipmentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDimensionChange = (dimension: keyof ShipmentFormData['dimensions'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [dimension]: value },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Информация об отправителе */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Информация об отправителе</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="ФИО отправителя"
            value={formData.senderName}
            onChange={(e) => handleInputChange('senderName', e.target.value)}
            required
          />
          <Input
            label="Телефон отправителя"
            type="tel"
            value={formData.senderPhone}
            onChange={(e) => handleInputChange('senderPhone', e.target.value)}
            required
          />
        </div>
        <Input
          label="Адрес отправителя"
          value={formData.senderAddress}
          onChange={(e) => handleInputChange('senderAddress', e.target.value)}
          required
        />
      </div>

      {/* Информация о получателе */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Информация о получателе</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="ФИО получателя"
            value={formData.recipientName}
            onChange={(e) => handleInputChange('recipientName', e.target.value)}
            required
          />
          <Input
            label="Телефон получателя"
            type="tel"
            value={formData.recipientPhone}
            onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
            required
          />
        </div>
        <Input
          label="Адрес получателя"
          value={formData.recipientAddress}
          onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
          required
        />
      </div>

      {/* Информация о грузе */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Информация о грузе</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Вес (кг)"
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            required
          />
          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Длина (см)"
              type="number"
              value={formData.dimensions.length}
              onChange={(e) => handleDimensionChange('length', e.target.value)}
              required
            />
            <Input
              label="Ширина (см)"
              type="number"
              value={formData.dimensions.width}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              required
            />
            <Input
              label="Высота (см)"
              type="number"
              value={formData.dimensions.height}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Описание груза
          </label>
          <textarea
            className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-background text-foreground"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Создание отправления...' : 'Создать отправление'}
        </Button>
      </div>
    </form>
  );
};
