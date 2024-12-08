'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Menu, Package, User, LogOut, Calculator, Truck } from 'lucide-react'
import { useAuth } from './providers/auth-provider'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const { user, logout } = useAuth()
  const { theme } = useTheme()

  const navItems = [
    {
      href: '/services/calculator',
      icon: Calculator,
      label: 'Калькулятор'
    },
    {
      href: '/services/tracking',
      icon: Truck,
      label: 'Отследить'
    },
    {
      href: '/dashboard',
      icon: User,
      label: 'Личный кабинет',
      requireAuth: true
    },
    {
      href: '/parcels',
      icon: Package,
      label: 'Мои посылки',
      requireAuth: true
    }
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pl-1 pr-0">
        <div className="px-7">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <Image
              src={theme === 'dark' ? '/logo-dark.svg' : '/logo.svg'}
              alt="Logo"
              width={130}
              height={25}
              className="dark:hidden"
            />
            <Image
              src="/logo-dark.svg"
              alt="Logo"
              width={130}
              height={25}
              className="hidden dark:block"
            />
          </Link>
        </div>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {navItems.map(
              (item) =>
                (!item.requireAuth || user) && (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center text-sm font-medium text-muted-foreground',
                      item.href === '/dashboard' && 'text-foreground'
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                )
            )}
            {user ? (
              <Button
                variant="ghost"
                className="justify-start px-2"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center text-sm font-medium text-muted-foreground"
              >
                <User className="mr-2 h-4 w-4" />
                Войти
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}