import * as React from 'react'
import { User } from '@/types/user'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Phone, User as UserIcon, MessageSquare } from 'lucide-react' 

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div>
      {/* Профиль пользователя */}
    </div>
  );
} 