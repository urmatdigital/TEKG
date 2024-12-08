'use client'

import * as React from 'react'
import { Button } from './ui/button'
import { motion } from 'framer-motion'
import { Package, ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 bg-card">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
          >
            Tulpar Express - Ваш надежный партнер в доставке
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-muted-foreground"
          >
            Быстрая и надежная доставка по всему Кыргызстану. Отправляйте и получайте посылки с комфортом.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button size="lg" className="gap-2">
              <Package className="h-5 w-5" />
              Начать отправку
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              Узнать больше
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 