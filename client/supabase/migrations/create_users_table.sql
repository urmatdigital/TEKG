-- Включаем расширение для телефонной аутентификации
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создаем перечисление для статуса верификации
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified');

-- Создаем таблицу пользователей
CREATE TABLE IF NOT EXISTS public.users (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    phone text UNIQUE NOT NULL,
    phone_verified boolean DEFAULT false,
    verification_code text,
    verification_code_expires_at timestamp with time zone,
    first_name text,
    last_name text,
    telegram_id text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Включаем RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Создаем политики доступа
CREATE POLICY "Пользователи могут видеть только свои данные" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Пользователи могут обновлять только свои данные" ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Создаем функцию для обновления updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Создаем триггер для обновления updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Создаем функцию для генерации кода верификации
CREATE OR REPLACE FUNCTION public.generate_verification_code(length integer DEFAULT 6)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    chars text := '0123456789';
    result text := '';
    i integer;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$;

-- Создаем функцию для обработки новых пользователей
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.users (id, phone, verification_code, verification_code_expires_at)
    VALUES (
        NEW.id,
        NEW.phone,
        public.generate_verification_code(),
        now() + interval '15 minutes'
    );
    RETURN NEW;
END;
$$;

-- Создаем триггер для новых пользователей
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Создаем функцию для проверки кода верификации
CREATE OR REPLACE FUNCTION public.verify_phone(
    user_id uuid,
    verification_code text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record public.users;
BEGIN
    -- Получаем запись пользователя
    SELECT * INTO user_record
    FROM public.users
    WHERE id = user_id;

    -- Проверяем существование пользователя
    IF user_record IS NULL THEN
        RETURN false;
    END IF;

    -- Проверяем код и срок его действия
    IF user_record.verification_code = verification_code 
       AND user_record.verification_code_expires_at > now() 
       AND NOT user_record.phone_verified THEN
        -- Обновляем статус верификации
        UPDATE public.users
        SET phone_verified = true,
            verification_code = NULL,
            verification_code_expires_at = NULL
        WHERE id = user_id;
        RETURN true;
    END IF;

    RETURN false;
END;
$$;
