"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("../config");
class ParcelService {
    constructor() {
        if (!config_1.config.supabase.url || !config_1.config.supabase.serviceRoleKey) {
            throw new Error('Missing Supabase configuration');
        }
        this.supabase = (0, supabase_js_1.createClient)(config_1.config.supabase.url, config_1.config.supabase.serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
    }
    async createParcel(data) {
        try {
            console.log('Creating parcel:', data);
            const { data: parcel, error } = await this.supabase
                .from('parcels')
                .insert(Object.assign(Object.assign({}, data), { status: 'NEW', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }))
                .select()
                .single();
            if (error)
                throw error;
            return { parcel };
        }
        catch (error) {
            console.error('Create parcel error:', {
                error,
                stack: error instanceof Error ? error.stack : undefined,
                data
            });
            throw error;
        }
    }
    async updateParcel(id, data) {
        try {
            console.log('Updating parcel:', { id, data });
            const { data: parcel, error } = await this.supabase
                .from('parcels')
                .update(Object.assign(Object.assign({}, data), { updated_at: new Date().toISOString() }))
                .eq('id', id)
                .select()
                .single();
            if (error)
                throw error;
            return { parcel };
        }
        catch (error) {
            console.error('Update parcel error:', {
                error,
                stack: error instanceof Error ? error.stack : undefined,
                id,
                data
            });
            throw error;
        }
    }
    async getParcelById(id) {
        try {
            const { data: parcel, error } = await this.supabase
                .from('parcels')
                .select('*, users!inner(*)')
                .eq('id', id)
                .single();
            if (error)
                throw error;
            return { parcel };
        }
        catch (error) {
            console.error('Get parcel error:', {
                error,
                stack: error instanceof Error ? error.stack : undefined,
                id
            });
            throw error;
        }
    }
    async getUserParcels(user_id) {
        try {
            const { data: parcels, error } = await this.supabase
                .from('parcels')
                .select('*')
                .eq('user_id', user_id)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            return { parcels };
        }
        catch (error) {
            console.error('Get user parcels error:', {
                error,
                stack: error instanceof Error ? error.stack : undefined,
                user_id
            });
            throw error;
        }
    }
    async updateParcelStatus(id, status, notes) {
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
            if (error)
                throw error;
            return { parcel };
        }
        catch (error) {
            console.error('Update parcel status error:', {
                error,
                stack: error instanceof Error ? error.stack : undefined,
                id,
                status
            });
            throw error;
        }
    }
    async getAllParcels(status) {
        try {
            let query = this.supabase
                .from('parcels')
                .select('*, users!inner(*)');
            if (status) {
                query = query.eq('status', status.toUpperCase());
            }
            const { data: parcels, error } = await query
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            return { parcels };
        }
        catch (error) {
            console.error('Get all parcels error:', {
                error,
                stack: error instanceof Error ? error.stack : undefined,
                status
            });
            throw error;
        }
    }
}
exports.ParcelService = ParcelService;
//# sourceMappingURL=ParcelService.js.map