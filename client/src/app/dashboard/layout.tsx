'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Home, Package, Search, Users, LogOut } from '@/components/icons'
import Button from '@/components/ui/Button'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { signOut } = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const navigation = [
    { name: 'Главная', href: '/dashboard', icon: Home },
    { name: 'Отправления', href: '/dashboard/shipments', icon: Package },
    { name: 'Отслеживание', href: '/dashboard/tracking', icon: Search },
    { name: 'Рефералы', href: '/dashboard/referrals', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Боковая навигация */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold">TE.KG</span>
                </Link>
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'mr-3 h-5 w-5',
                          isActive
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex flex-shrink-0 border-t p-4">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => signOut()}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Выйти
              </Button>
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex flex-1 flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}