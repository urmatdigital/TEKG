'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Package, Search, CheckCircle } from 'lucide-react'

export function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('')

  return (
    <div className="bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Отследить посылку
          </h2>
          <div className="flex gap-4">
            <Input
              placeholder="Введите номер отслеживания"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1"
            />
            <Button className="gap-2">
              <Search className="h-5 w-5" />
              Отследить
            </Button>
          </div>
          
          {trackingNumber && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>На складе в КНР</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>В пути</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>На складе в Бишкеке</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <Package className="h-5 w-5" />
                <span>Выдано</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 