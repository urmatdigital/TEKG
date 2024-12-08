interface LoadingStateProps {
  retryCount: number;
  maxRetries: number;
}

export function LoadingState({ retryCount, maxRetries }: LoadingStateProps) {
  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
      <p className="text-gray-600">
        {retryCount > 0 ? `Попытка ${retryCount} из ${maxRetries}...` : 'Загрузка...'}
      </p>
    </div>
  );
} 