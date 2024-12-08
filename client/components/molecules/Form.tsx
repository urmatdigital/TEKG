import React from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  error?: string;
  children?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  loading = false,
  error,
  children,
  className,
  ...props
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-4 ${className}`}
      {...props}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {children}

      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </form>
  );
};

export { Form };
