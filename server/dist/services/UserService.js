"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const auth_1 = require("../utils/auth");
const config_1 = require("../config");
class UserService {
    constructor() {
        if (!config_1.config.supabase.url || !config_1.config.supabase.serviceRoleKey) {
            throw new Error('Missing Supabase configuration');
        }
        this.supabase = (0, supabase_js_1.createClient)(config_1.config.supabase.url, config_1.config.supabase.serviceRoleKey);
    }
    async registerWithTelegram(data) {
        try {
            console.log('Registering user with data:', data);
            const { data: existingUser } = await this.supabase
                .from('users')
                .select()
                .eq('telegram_id', data.telegram_id)
                .single();
            if (existingUser) {
                return { user: existingUser, isNew: false };
            }
            const authCode = (0, auth_1.generateAuthCode)();
            const { data: newUser, error: insertError } = await this.supabase
                .from('users')
                .insert({
                telegram_id: data.telegram_id,
                first_name: data.first_name,
                last_name: data.last_name,
                username: data.username,
                phone: data.phone,
                avatar_url: data.avatar_url,
                auth_code: authCode,
                role: 'USER',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
                .select()
                .single();
            if (insertError)
                throw insertError;
            if (!newUser)
                throw new Error('Failed to create user');
            return { user: newUser, isNew: true, authCode };
        }
        catch (error) {
            console.error('Register error details:', error);
            throw error;
        }
    }
    async updateProfile(userId, data) {
        const { data: user, error } = await this.supabase
            .from('users')
            .update(Object.assign(Object.assign({}, data), { updated_at: new Date().toISOString() }))
            .eq('id', userId)
            .select()
            .single();
        if (error)
            throw error;
        if (!user)
            throw new Error('User not found');
        return user;
    }
    async getUserById(userId) {
        const { data: user, error } = await this.supabase
            .from('users')
            .select()
            .eq('id', userId)
            .single();
        if (error)
            throw error;
        if (!user)
            throw new Error('User not found');
        return user;
    }
    async getUserByTelegramId(telegram_id) {
        const { data: user, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('telegram_id', telegram_id)
            .single();
        if (error)
            throw error;
        return user;
    }
    async updateUserPhone(userId, phone) {
        return this.updateProfile(userId, { phone });
    }
    async updateUserAddress(userId, address) {
        return this.updateProfile(userId, { address });
    }
    async verifyAuthCode(telegram_id, authCode) {
        const user = await this.getUserByTelegramId(telegram_id);
        return user.auth_code === authCode;
    }
    async isProfileComplete(userId) {
        const user = await this.getUserById(userId);
        return Boolean(user.phone && user.address);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map