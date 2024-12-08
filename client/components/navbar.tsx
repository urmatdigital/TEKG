'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FaUser, FaSignInAlt, FaHome, FaMoon, FaSun } from 'react-icons/fa';

export function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
              <Image
                src="/tulpar.png"
                alt="Tulpar Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
                priority
              />
              <Image
                src={theme === 'dark' ? '/tulpar_text_logo_dark.svg' : '/tulpar_text_logo_light.svg'}
                alt="Tulpar"
                width={120}
                height={30}
                className="h-8 w-auto hidden sm:block"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`${
                theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              } px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1`}
            >
              <FaHome className="text-xl" />
              <span>Главная</span>
            </Link>
            
            <button
              onClick={toggleTheme}
              className={`${
                theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              } p-2 rounded-md`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>
            
            {user ? (
              <Link
                href="/profile"
                className={`${
                  theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                } px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1`}
              >
                <FaUser className="text-xl" />
                <span>Профиль</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
              >
                <FaSignInAlt className="text-xl" />
                <span>Войти</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}