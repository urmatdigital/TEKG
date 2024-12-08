'use client'

import * as React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

export function CallToAction() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Готовы начать?
            <br />
            Отправьте посылку прямо сейчас
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Зарегистрируйтесь и получите доступ к полному функционалу нашего сервиса
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/register">
                Начать бесплатно
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/contact">
                Связаться с нами
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 