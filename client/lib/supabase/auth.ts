import { createClient } from './server';

export const supabaseAuth = {
  signUp: async (phone: string) => {
    const supabase = createClient();
    
    // Проверяем существование пользователя
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingUser) {
      throw new Error('Пользователь с таким телефоном уже существует');
    }

    // Создаем временную запись пользователя
    const { error } = await supabase
      .from('temp_users')
      .insert({ phone });

    if (error) {
      throw new Error('Ошибка при создании временного пользователя');
    }

    return { success: true };
  },

  verifyAndCreateUser: async (phone: string, code: string) => {
    const supabase = createClient();

    // Проверяем существование временного пользователя
    const { data: tempUser } = await supabase
      .from('temp_users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (!tempUser) {
      throw new Error('Пользователь не найден. Пожалуйста, начните регистрацию заново');
    }

    // В реальном приложении здесь будет проверка кода из Telegram
    // Создаем пользователя в auth.users через admin API
    const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
      phone,
      email: `${phone.replace(/[^0-9]/g, '')}@example.com`,
      password: code,
      email_confirm: true,
      phone_confirm: true
    });

    if (authError) {
      throw new Error('Ошибка при создании пользователя');
    }

    if (!user) {
      throw new Error('Пользователь не создан');
    }

    // Создаем профиль пользователя
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        phone,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      // Если произошла ошибка, удаляем созданного пользователя
      await supabase.auth.admin.deleteUser(user.id);
      throw new Error('Ошибка при создании профиля');
    }

    // Удаляем временного пользователя
    await supabase
      .from('temp_users')
      .delete()
      .eq('phone', phone);

    return { user };
  }
};
