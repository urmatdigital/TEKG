'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">О компании</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-primary">
                  Вакансии
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-primary">
                  Новости
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Услуги</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/services/express" className="text-muted-foreground hover:text-primary">
                  Экспресс-доставка
                </Link>
              </li>
              <li>
                <Link href="/services/international" className="text-muted-foreground hover:text-primary">
                  Международная доставка
                </Link>
              </li>
              <li>
                <Link href="/services/cargo" className="text-muted-foreground hover:text-primary">
                  Грузоперевозки
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Поддержка</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-primary">
                  Центр поддержки
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  Часто задаваемые вопросы
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Связаться с нами
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Контакты</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-muted-foreground">
                Телефон: +996 XXX XXX XXX
              </li>
              <li className="text-muted-foreground">
                Email: info@tekg.kg
              </li>
              <li className="text-muted-foreground">
                Адрес: г. Бишкек, ул. Примерная, 123
              </li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TEKG. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
