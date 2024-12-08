export function formatDate(date: string | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
}

export function formatWeight(weight: number | null): string {
  if (!weight) return '-';
  return `${weight} кг`;
}

export function formatDimensions(dimensions: any): string {
  if (!dimensions) return '-';
  const { length, width, height } = dimensions;
  return `${length}x${width}x${height} см`;
}

export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    created: 'Создан',
    accepted: 'Принят',
    in_warehouse: 'На складе',
    in_transit: 'В пути',
    out_for_delivery: 'На доставке',
    delivered: 'Доставлен',
    returned: 'Возвращен',
    lost: 'Утерян'
  };
  return statusMap[status] || status;
} 