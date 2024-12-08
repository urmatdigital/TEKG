'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types/user'
import { useAuth } from '@/components/providers'
import { DashboardHeader } from '@/components/dashboard/header'
import { UserProfile } from '@/components/dashboard/user-profile'
import { PackagesList } from '@/components/dashboard/packages-list'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader user={user} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-1">
          <UserProfile user={user} />
        </div>
        
        <div className="md:col-span-2">
          <PackagesList />
        </div>
      </div>
    </div>
  )
} 