'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { Provider } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signInWithTelegram: (telegramData: any) => Promise<void>;
  signOut: () => Promise<void>;
  setPassword: (phone: string, password: string) => Promise<void>;
  loginWithPassword: (phone: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  signInWithTelegram: async () => {},
  signOut: async () => {},
  setPassword: async () => {},
  loginWithPassword: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser(profile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithTelegram = async (telegramData: any): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'telegram' as Provider,
        options: {
          queryParams: {
            auth_data: JSON.stringify(telegramData)
          }
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Telegram:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const setPassword = async (phone: string, password: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      // Update the phone number in the profiles table
      if (user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ phone })
          .eq('id', user.id);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error setting password:', error);
      throw error;
    }
  };

  const loginWithPassword = async (phone: string, password: string): Promise<void> => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .single();

      if (profileError) {
        throw new Error('Пользователь не найден');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${profile.telegram_id}@telegram.user`,
        password: password
      });

      if (signInError) {
        throw signInError;
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signInWithTelegram,
        signOut,
        setPassword,
        loginWithPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
