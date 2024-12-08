import React from 'react';

interface LoadingStateProps {
  retryCount: number;
  maxRetries: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ retryCount, maxRetries }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <div className="text-gray-600">
          Загрузка данных{Array(retryCount + 1).fill('.').join('')}
        </div>
        {retryCount > 0 && (
          <div className="text-sm text-gray-500 mt-2">
            Попытка {retryCount} из {maxRetries}
          </div>
        )}
      </div>
    </div>
  );
}; 