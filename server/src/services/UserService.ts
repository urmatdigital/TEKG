import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { generateAuthCode } from '../utils/auth';
import { config } from '../config';
import { User, UserResponse, RegisterWithTelegramData, UpdateUserProfileData } from '../types/user.types';

export class UserService {
  private supabase;

  constructor() {
    if (!config.supabase.url || !config.supabase.serviceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }
    this.supabase = createClient<Database>(config.supabase.url, config.supabase.serviceRoleKey);
  }

  async registerWithTelegram(data: RegisterWithTelegramData): Promise<UserResponse> {
    try {
      console.log('Registering user with data:', data);

      // Проверяем, существует ли пользователь
      const { data: existingUser } = await this.supabase
        .from('users')
        .select()
        .eq('telegram_id', data.telegram_id)
        .single();

      if (existingUser) {
        return { user: existingUser, isNew: false };
      }

      // Генерируем код авторизации
      const authCode = generateAuthCode();

      // Создаем нового пользователя
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

      if (insertError) throw insertError;
      if (!newUser) throw new Error('Failed to create user');

      return { user: newUser, isNew: true, authCode };
    } catch (error) {
      console.error('Register error details:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, data: UpdateUserProfileData): Promise<User> {
    const { data: user, error } = await this.supabase
      .from('users')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!user) throw new Error('User not found');

    return user;
  }

  async getUserById(userId: string): Promise<User> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select()
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!user) throw new Error('User not found');

    return user;
  }

  async getUserByTelegramId(telegram_id: string): Promise<User> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegram_id)
      .single();

    if (error) throw error;
    return user;
  }

  async updateUserPhone(userId: string, phone: string): Promise<User> {
    return this.updateProfile(userId, { phone });
  }

  async updateUserAddress(userId: string, address: string): Promise<User> {
    return this.updateProfile(userId, { address });
  }

  async verifyAuthCode(telegram_id: string, authCode: string): Promise<boolean> {
    const user = await this.getUserByTelegramId(telegram_id);
    return user.auth_code === authCode;
  }

  async isProfileComplete(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    return Boolean(user.phone && user.address);
  }
}