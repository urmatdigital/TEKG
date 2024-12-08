'use client'

import * as React from 'react'
import { Card, CardHeader, CardContent } from '../ui/card'
import { Package, MapPin, Calendar } from 'lucide-react'

const packages = [
  {
    id: '1',
    trackingNumber: 'TE123456789',
    status: 'В пути',
    origin: 'Гуанчжоу, Китай',
    destination: 'Бишкек, Кыргызстан',
    date: '2024-03-20',
    statusColor: 'text-yellow-500'
  },
  {
    id: '2',
    trackingNumber: 'TE987654321',
    status: 'На складе',
    origin: 'Урумчи, Китай',
    destination: 'Бишкек, Кыргызстан',
    date: '2024-03-19',
    statusColor: 'text-primary'
  },
  {
    id: '3',
    trackingNumber: 'TE456789123',
    status: 'Доставлено',
    origin: 'Шанхай, Китай',
    destination: 'Ош, Кыргызстан',
    date: '2024-03-15',
    statusColor: 'text-green-500'
  }
]

export function PackagesList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Мои отправления</h2>
          <span className="text-sm text-muted-foreground">Всего: {packages.length}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex flex-col space-y-3 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-card ${pkg.statusColor}/10`}>
                    <Package className={`h-4 w-4 ${pkg.statusColor}`} />
                  </div>
                  <div>
                    <p className="font-medium">{pkg.trackingNumber}</p>
                    <p className={`text-sm ${pkg.statusColor}`}>{pkg.status}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {pkg.date}
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <p className="truncate">
                  {pkg.origin} → {pkg.destination}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}