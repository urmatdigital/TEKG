import * as React from 'react'
import { User } from '@/types/user'
import { Button } from '@/components/ui/button'
import { Package, Bell, LogOut } from 'lucide-react'
import { useAuth } from '@/components/providers' 

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header>
      {/* Содержимое header */}
    </header>
  );
} 