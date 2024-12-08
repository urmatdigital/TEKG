'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '../atoms/Button';
import { Sun, Moon, Menu } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Логотип и основная навигация */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                Tulpar Express
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground">
                Дашборд
              </Link>
              {user && (
                <Link href="/tracking" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground">
                  Отслеживание
                </Link>
              )}
            </div>
          </div>

          {/* Правая часть навигации */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-4"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.photo_url && (
                  <img
                    src={user.photo_url}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {user.first_name} {user.last_name}
                  </span>
                  {user?.telegram_id && (
                    <span className="text-xs text-muted-foreground">
                      ID: {user.telegram_id}
                    </span>
                  )}
                </div>
                <Button variant="ghost" onClick={logout}>
                  Выйти
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button>Войти</Button>
              </Link>
            )}

            {/* Мобильное меню */}
            <div className="flex items-center sm:hidden ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Мобильная навигация */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent"
              >
                Дашборд
              </Link>
              {user && (
                <Link
                  href="/tracking"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent"
                >
                  Отслеживание
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
