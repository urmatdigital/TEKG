'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, TelegramSession } from '@/types/auth.types';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithTelegram: (data: TelegramSession) => Promise<void>;
  loginWithPassword: (phone: string, password: string) => Promise<void>;
  setPassword: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Проверяем токен при загрузке
    const token = Cookies.get('token');
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Error parsing user data:', e);
          localStorage.removeItem('user');
        }
      }
    }
    setLoading(false);
  }, []);

  const handleAuthResponse = async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'Authentication failed');
    }

    const data = await response.json();
    if (data.token) {
      Cookies.set('token', data.token, { 
        secure: true,
        sameSite: 'strict',
        domain: process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '') || 'te.kg'
      });
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  };

  const loginWithTelegram = async (data: TelegramSession) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/telegram-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          telegram_id: data.telegram_id,
          chat_id: data.chat_id,
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          photo_url: data.photo_url,
        }),
      });

      await handleAuthResponse(response);
    } catch (err) {
      console.error('Error during Telegram login:', err);
      setError(err instanceof Error ? err.message : 'Failed to login with Telegram');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithPassword = async (phone: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ phone, password }),
      });

      await handleAuthResponse(response);
    } catch (err) {
      console.error('Error during password login:', err);
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setPassword = async (phone: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({ phone, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to set password' }));
        throw new Error(errorData.message || 'Failed to set password');
      }

      const data = await response.json();
      
      if (data.token) {
        Cookies.set('token', data.token, { 
          secure: true,
          sameSite: 'lax',
          domain: process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '') || 'te.kg'
        });
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }

      return data;
    } catch (err) {
      console.error('Error during password setup:', err);
      const message = err instanceof Error ? err.message : 'Failed to set password';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      Cookies.remove('token');
      localStorage.removeItem('user');
      setUser(null);
    } catch (err) {
      console.error('Error during logout:', err);
      setError(err instanceof Error ? err.message : 'Failed to logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginWithTelegram,
        loginWithPassword,
        setPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
