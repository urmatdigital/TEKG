'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function CalculatorPage() {
  const [weight, setWeight] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [cost, setCost] = useState<number | null>(null);

  const calculateCost = () => {
    const weightRate = 10; // $10 за кг
    const volumeRate = 100; // $100 за м³

    const weightCost = weight * weightRate;
    const volumeCost = volume * volumeRate;

    // Выбираем большую стоимость
    const finalCost = Math.max(weightCost, volumeCost);
    setCost(finalCost);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Калькулятор стоимости доставки</h1>
      
      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Вес (кг)
          </label>
          <Input
            type="number"
            min="0"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            placeholder="Введите вес груза"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Объем (м³)
          </label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value) || 0)}
            placeholder="Введите объем груза"
          />
        </div>

        <Button
          onClick={calculateCost}
          className="w-full"
        >
          Рассчитать стоимость
        </Button>

        {cost !== null && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg">
            <p className="text-lg font-semibold">
              Стоимость доставки: ${cost.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
