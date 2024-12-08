import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { ToastProvider } from '@/components/ui/Toast';
import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="pt-16">
            <Component {...pageProps} />
            <ToastProvider />
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}