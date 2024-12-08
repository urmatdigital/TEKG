import { cn } from '@/lib/utils';

interface DividerProps {
  children?: React.ReactNode;
  className?: string;
}

export function Divider({ children, className }: DividerProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      {children && (
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">{children}</span>
        </div>
      )}
    </div>
  );
} 