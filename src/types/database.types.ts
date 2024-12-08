export type { Database } from '../../server/types/database.types';

// Вспомогательные типы для упрощения использования
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T] 