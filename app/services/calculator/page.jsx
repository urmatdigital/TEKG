'use client';

import { useState } from 'react';

export default function CalculatorPage() {
  const [weight, setWeight] = useState('');
  const [volume, setVolume] = useState('');
  const [result, setResult] = useState(null);

  const calculateCost = () => {
    // Базовые ставки (примерные значения)
    const weightRate = 10; // $10 за кг
    const volumeRate = 100; // $100 за м³

    const weightCost = weight * weightRate;
    const volumeCost = volume * volumeRate;

    // Выбираем большую стоимость
    const finalCost = Math.max(weightCost, volumeCost);
    setResult(finalCost);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Калькулятор стоимости доставки</h1>
      
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Вес (кг)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите вес"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Объем (м³)
            </label>
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите объем"
            />
          </div>

          <button
            onClick={calculateCost}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Рассчитать
          </button>

          {result !== null && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p className="text-lg font-semibold">
                Стоимость доставки: ${result}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: 'Калькулятор доставки | Tulpar Express',
  description: 'Рассчитайте стоимость доставки вашего груза'
}; 