import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Пути, которые не требуют аутентификации
const publicPaths = [
  '/',  // Главная страница
  '/auth/login',
  '/auth/register',
  '/auth/set-password',  // Добавляем страницу установки пароля
  '/auth/callback',
  '/api/auth/telegram/login',
  '/api/auth/login',
  '/api/auth/set-password'
]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.searchParams

  // Специальная обработка для страницы установки пароля
  if (pathname === '/auth/set-password') {
    const phone = searchParams.get('phone')
    if (!phone) {
      const loginUrl = new URL('/auth/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Проверяем, является ли путь публичным
  if (publicPaths.includes(pathname) || pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // Если нет токена и путь не публичный, редиректим на страницу входа
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Если есть токен и пользователь пытается зайти на страницу входа/регистрации,
  // редиректим на дашборд
  if (token && (pathname === '/auth/login' || pathname === '/auth/register')) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // Если есть токен, пропускаем запрос
  return NextResponse.next()
}

// Указываем, для каких путей применять middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
