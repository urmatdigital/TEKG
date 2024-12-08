import { createClient } from './server';

export const supabaseAuth = {
  async signUp(phone: string) {
    const supabase = createClient();
    
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('phone')
      .eq('phone', phone)
      .single();

    if (existingUser) {
      throw new Error('Пользователь с таким номером телефона уже существует');
    }

    // In a real app, you would integrate with an SMS service here
    // For now, we'll just return a mock verification code
    return {
      verificationCode: '123456', // In production, generate a random code
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    };
  },

  async verifyCode(phone: string, code: string) {
    // In a real app, you would verify the code against what was sent
    // For now, we'll just check if it matches our mock code
    if (code !== '123456') {
      throw new Error('Неверный код подтверждения');
    }

    return true;
  },

  async createUser(phone: string, password: string) {
    const supabase = createClient();
    
    // Create the user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      phone,
      password,
    });

    if (authError) {
      throw authError;
    }

    // Create the user profile in our users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authUser.user!.id,
          phone,
          created_at: new Date().toISOString(),
        },
      ]);

    if (profileError) {
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authUser.user!.id);
      throw profileError;
    }

    return authUser;
  },

  async signIn(phone: string, password: string) {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      phone,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
  },
};
