'use client';

import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Компания */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Компания
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-sm text-muted-foreground hover:text-foreground">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Услуги */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Услуги
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/services/delivery" className="text-sm text-muted-foreground hover:text-foreground">
                  Доставка
                </Link>
              </li>
              <li>
                <Link href="/services/tracking" className="text-sm text-muted-foreground hover:text-foreground">
                  Отслеживание
                </Link>
              </li>
            </ul>
          </div>

          {/* Поддержка */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Поддержка
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground">
                  Служба поддержки
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Контакты
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="text-sm text-muted-foreground">
                Телефон: +7 (XXX) XXX-XX-XX
              </li>
              <li className="text-sm text-muted-foreground">
                Email: info@tulparexpress.kz
              </li>
              <li className="text-sm text-muted-foreground">
                Адрес: г. Алматы, ул. Примерная, 123
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Tulpar Express. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};
