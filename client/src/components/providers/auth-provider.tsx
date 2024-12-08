'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types/user';
import { AuthContextType } from '@/types/auth.types';

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  signInWithTelegram: async () => {},
  signOut: async () => {},
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

        setUser(profile || {
          id: session.user.id,
          telegram_id: undefined,
          first_name: '',
          last_name: '',
          username: '',
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithTelegram = async (telegramData: any) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'telegram' as any,
      options: {
        queryParams: {
          auth_data: JSON.stringify(telegramData)
        }
      }
    });
    if (error) throw error;
  };

  const loginWithPassword = async (phone: string, password: string) => {
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
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signInWithTelegram,
        signOut,
        loginWithPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 