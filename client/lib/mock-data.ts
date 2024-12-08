export const mockParcels = [
  {
    id: '1',
    tracking_number: 'TLP-001',
    status: 'in_transit',
    description: 'Электроника',
    weight: 2.5,
    created_at: '2024-12-01',
    estimated_delivery: '2024-12-10',
  },
  {
    id: '2',
    tracking_number: 'TLP-002',
    status: 'delivered',
    description: 'Одежда',
    weight: 1.2,
    created_at: '2024-12-02',
    estimated_delivery: '2024-12-08',
  },
  // Добавьте больше моковых данных по необходимости
];

export const mockStats = {
  active_parcels: 156,
  avg_delivery_time: '5.2 days',
  revenue: '$12,450',
  efficiency: '94%',
};

export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  client_code: 'TLP-USER-001',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
};
