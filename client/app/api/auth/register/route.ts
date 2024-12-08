import { NextResponse } from 'next/server';
import { supabaseAuth } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  try {
    const { phone, code, password } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Телефон обязателен' },
        { status: 400 }
      );
    }

    // Если код не предоставлен, это первый шаг регистрации - отправка кода
    if (!code) {
      try {
        const result = await supabaseAuth.signUp(phone);
        return NextResponse.json({ success: true, ...result });
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Ошибка при регистрации' },
          { status: 400 }
        );
      }
    }

    // Если код предоставлен, но нет пароля - это второй шаг - верификация кода
    if (!password) {
      try {
        const isValid = await supabaseAuth.verifyCode(phone, code);
        return NextResponse.json({ success: isValid });
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Ошибка при верификации' },
          { status: 400 }
        );
      }
    }

    // Если предоставлены и код, и пароль - это финальный шаг - создание пользователя
    try {
      const { user } = await supabaseAuth.createUser(phone, password);
      return NextResponse.json({ success: true, user });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Ошибка при создании пользователя' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
