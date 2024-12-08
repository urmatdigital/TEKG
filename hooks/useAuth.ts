'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { z } from 'zod';
import { User, AuthContextType, UserSchema, AuthContextSchema } from '../types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Валидация данных с помощью Zod
        const validatedUser = UserSchema.parse(parsedUser);
        setToken(savedToken);
        setUser(validatedUser);
      } catch (error) {
        console.error('Error parsing or validating saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = useCallback((newUser: User, newToken: string) => {
    try {
      // Валидация входных данных
      const validatedUser = UserSchema.parse(newUser);
      z.string().parse(newToken);

      setUser(validatedUser);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(validatedUser));
    } catch (error) {
      console.error('Invalid login data:', error);
      throw new Error('Invalid login data');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout
  };

  // Валидация контекста перед передачей
  const validatedValue = AuthContextSchema.parse(value);

  return (
    <AuthContext.Provider value={validatedValue}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export { AuthProvider, useAuth };