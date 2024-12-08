import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className={cn('mx-auto flex w-full flex-col justify-center space-y-6', className)}>
          {children}
        </div>
      </div>
    </div>
  );
} 