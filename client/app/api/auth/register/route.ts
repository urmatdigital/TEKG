import { NextResponse } from 'next/server';
import { supabaseAuth } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const phone = formData.get('phone') as string;
    const code = formData.get('code') as string;

    if (!phone) {
      return NextResponse.json(
        { error: 'Телефон обязателен' },
        { status: 400 }
      );
    }

    // Если код не предоставлен, это первый шаг регистрации
    if (!code) {
      try {
        await supabaseAuth.signUp(phone);
        return NextResponse.json({ success: true });
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Ошибка при регистрации' },
          { status: 400 }
        );
      }
    }

    // Если код предоставлен, это второй шаг - верификация
    try {
      const { user } = await supabaseAuth.verifyAndCreateUser(phone, code);
      return NextResponse.json({ success: true, user });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Ошибка при верификации' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
