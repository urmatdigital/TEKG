'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '../types/user'
import { supabase } from '@/lib/supabase/client'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (phone: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (phone: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setUser(profile)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = async (phone: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      phone,
      password,
    })
    if (error) throw error
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const register = async (phone: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      phone,
      password,
    })
    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
