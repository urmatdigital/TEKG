import { Providers } from '@/components/Providers';
import Navbar from '@/components/Navbar';
import '@/styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          {children}
        </div>
      </body>
    </html>
  );
} 