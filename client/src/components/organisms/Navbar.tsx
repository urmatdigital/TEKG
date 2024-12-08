'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Package, User, LogOut } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold">
            TEKG
          </Link>

          {user && (
            <div className="hidden space-x-6 md:flex">
              <Link
                href="/dashboard"
                className={`text-sm ${
                  isActive('/dashboard')
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Панель управления
              </Link>
              <Link
                href="/shipments"
                className={`text-sm ${
                  isActive('/shipments')
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Отправления
              </Link>
              <Link
                href="/tracking"
                className={`text-sm ${
                  isActive('/tracking')
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Отслеживание
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-9 w-9"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button>Войти</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
