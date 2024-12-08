import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { config } from '../config';

interface CreateParcelData {
  user_id: number;
  description: string;
  photo_url?: string | null;
  tracking_number?: string | null;
}

interface UpdateParcelData {
  description?: string;
  photo_url?: string | null;
  tracking_number?: string | null;
  status?: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string | null;
}

export class ParcelService {
  private supabase;

  constructor() {
    if (!config.supabase.url || !config.supabase.serviceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }

    this.supabase = createClient<Database>(
      config.supabase.url,
      config.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  async createParcel(data: CreateParcelData) {
    try {
      console.log('Creating parcel:', data);

      const { data: parcel, error } = await this.supabase
        .from('parcels')
        .insert({
          ...data,
          status: 'NEW',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { parcel };
    } catch (error) {
      console.error('Create parcel error:', {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        data
      });
      throw error;
    }
  }

  async updateParcel(id: number, data: UpdateParcelData) {
    try {
      console.log('Updating parcel:', { id, data });

      const { data: parcel, error } = await this.supabase
        .from('parcels')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { parcel };
    } catch (error) {
      console.error('Update parcel error:', {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        id,
        data
      });
      throw error;
    }
  }

  async getParcelById(id: number) {
    try {
      const { data: parcel, error } = await this.supabase
        .from('parcels')
        .select('*, users!inner(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { parcel };
    } catch (error) {
      console.error('Get parcel error:', {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        id
      });
      throw error;
    }
  }

  async getUserParcels(user_id: number) {
    try {
      const { data: parcels, error } = await this.supabase
        .from('parcels')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { parcels };
    } catch (error) {
      console.error('Get user parcels error:', {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        user_id
      });
      throw error;
    }
  }

  async updateParcelStatus(id: number, status: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED', notes?: string) {
    try {
      console.log('Updating parcel status:', { id, status, notes });

      const { data: parcel, error } = await this.supabase
        .from('parcels')
        .update({
          status,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { parcel };
    } catch (error) {
      console.error('Update parcel status error:', {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        id,
        status
      });
      throw error;
    }
  }

  async getAllParcels(status?: string) {
    try {
      let query = this.supabase
        .from('parcels')
        .select('*, users!inner(*)');

      if (status) {
        query = query.eq('status', status.toUpperCase());
      }

      const { data: parcels, error } = await query
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { parcels };
    } catch (error) {
      console.error('Get all parcels error:', {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        status
      });
      throw error;
    }
  }
}
