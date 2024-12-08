import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Search } from 'lucide-react';

interface TrackingSearchProps {
  onSearch: (trackingNumber: string) => void;
}

export const TrackingSearch: React.FC<TrackingSearchProps> = ({ onSearch }) => {
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onSearch(trackingNumber.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Введите номер отправления"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full"
          />
        </div>
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Отследить
        </Button>
      </form>
    </div>
  );
};
