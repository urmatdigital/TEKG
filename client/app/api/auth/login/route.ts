import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const supabase = createClient()

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json()

    // Аутентификация пользователя
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
      phone,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: 'Неверный номер телефона или пароль' },
        { status: 401 }
      )
    }

    // Получаем данные профиля пользователя
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Ошибка аутентификации' },
        { status: 401 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      throw profileError
    }

    // Проверяем, верифицирован ли пользователь
    if (!profile.verified) {
      return NextResponse.json(
        { error: 'Пожалуйста, подтвердите свой номер телефона' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      user: profile,
      token: session?.access_token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Ошибка при входе' },
      { status: 500 }
    )
  }
}
