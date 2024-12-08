import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

export { toast };

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}
    />
  );
} 