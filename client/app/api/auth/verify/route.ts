import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkVerificationCode } from '@/lib/twilio';

export async function POST(request: NextRequest) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'ID пользователя и код подтверждения обязательны' },
        { status: 400 }
      );
    }

    console.log('Getting user data...');
    const supabase = createClient();

    // Получаем данные пользователя
    const { data: profile, error: userError } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error getting user:', userError);
      return NextResponse.json(
        { error: 'Ошибка при получении данных пользователя' },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    console.log('Checking verification code...');
    // Проверяем код подтверждения
    try {
      const isValid = await checkVerificationCode(profile.phone, code);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Неверный код подтверждения' },
          { status: 400 }
        );
      }
    } catch (twilioError) {
      console.error('Error checking verification code:', twilioError);
      return NextResponse.json(
        { error: 'Ошибка при проверке кода подтверждения' },
        { status: 500 }
      );
    }

    console.log('Updating user verification status...');
    // Обновляем статус верификации пользователя
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ verified: true })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user verification status:', updateError);
      return NextResponse.json(
        { error: 'Ошибка при обновлении статуса верификации' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Телефон успешно подтвержден' });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
