import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AlertProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'destructive'
}

export function Alert({
  children,
  className,
  variant = 'default',
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4',
        {
          'bg-destructive/15 text-destructive border-destructive/50': variant === 'destructive',
          'bg-background text-foreground border-border': variant === 'default',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
