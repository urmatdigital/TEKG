'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type User } from '@supabase/supabase-js'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  loading: boolean
  register: (phone: string, password: string) => Promise<void>
  login: (phone: string, password: string) => Promise<void>
  logout: () => Promise<void>
  verifyPhone: (userId: string, code: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const register = async (phone: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        phone,
        password,
        options: {
          data: {
            phone,
          },
        },
      })

      if (error) throw error
    } catch (error) {
      console.error('Error in register:', error)
      throw error
    }
  }

  const verifyPhone = async (userId: string, code: string) => {
    try {
      const { data, error } = await supabase.rpc('verify_phone', {
        user_id: userId,
        verification_code: code,
      })

      if (error) throw error
      if (!data) throw new Error('Неверный код верификации')

      toast.success('Телефон успешно подтвержден')
      router.push('/login')
    } catch (error) {
      console.error('Error in verifyPhone:', error)
      throw error
    }
  }

  const login = async (phone: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      })

      if (error) throw error

      // Проверяем верификацию телефона
      const { data: userData } = await supabase
        .from('users')
        .select('phone_verified')
        .eq('phone', phone)
        .single()

      if (!userData?.phone_verified) {
        throw new Error('Телефон не подтвержден')
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error in login:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (error) {
      console.error('Error in logout:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    verifyPhone,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}