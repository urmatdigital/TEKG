import { supabase } from '@/lib/supabase'

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
  added_to_attachment_menu?: boolean;
  photo_url?: string;
}

export const getTelegramUser = (): TelegramUser | null => {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
    return null;
  }

  const webApp = window.Telegram.WebApp;
  const user = webApp.initDataUnsafe.user;
  
  if (!user) return null;

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    language_code: user.language_code,
    is_premium: user.is_premium,
    allows_write_to_pm: user.allows_write_to_pm,
    added_to_attachment_menu: user.added_to_attachment_menu,
    photo_url: user.photo_url
  };
}

export const autoLoginWithTelegram = async (supabase: any) => {
  const user = getTelegramUser();
  if (!user) return null;

  try {
    // Проверяем существующий профиль
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('telegram_id', user.id)
      .single();

    if (!profile) return null;

    // Авторизуемся с помощью auth_code
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email: `${user.id}@telegram.user`,
      password: profile.auth_code
    });

    if (error) throw error;

    // Обновляем профиль актуальными данными из Telegram
    await supabase
      .from('profiles')
      .update({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        language_code: user.language_code,
        is_premium: user.is_premium,
        photo_url: user.photo_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id);

    return session;
  } catch (error) {
    console.error('Auto login error:', error);
    return null;
  }
}

export const getWebAppTheme = () => {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
    return null;
  }

  const webApp = window.Telegram.WebApp;
  return {
    colorScheme: webApp.colorScheme,
    themeParams: webApp.themeParams,
    platform: webApp.platform
  };
} 