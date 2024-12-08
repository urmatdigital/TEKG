import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Маршруты, которые не требуют аутентификации
const publicRoutes = ['/auth/login', '/auth/register', '/auth/telegram-login'];

// Маршруты, которые требуют аутентификации
const protectedRoutes = ['/profile', '/settings'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Если путь начинается с /api, пропускаем middleware
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Если это публичный маршрут, пропускаем
  if (publicRoutes.includes(pathname)) {
    // Если пользователь уже авторизован и пытается зайти на страницу входа/регистрации,
    // перенаправляем его на главную
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Если это защищенный маршрут и пользователь не авторизован,
  // перенаправляем на страницу входа
  if (protectedRoutes.includes(pathname) && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
