'use client'

import * as React from 'react'
import { User } from '../../types/user'
import { Card, CardHeader, CardContent } from '../ui/card'
import { Phone, User as UserIcon, MessageSquare } from 'lucide-react'
import { Button } from '../ui/button'

interface UserProfileProps {
  user: User
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.first_name} {user.last_name}</h2>
            <p className="text-sm text-muted-foreground">ID: {user.id}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{user.phone || 'Не указан'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span>{user.telegram_id || 'Не привязан'}</span>
          </div>
          <div className="pt-4">
            <Button variant="outline" className="w-full">
              Редактировать профиль
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}