-- Пересоздаем схему
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Базовые права
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;

-- Включаем расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создаем типы
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
      'client',
      'admin',
      'warehouse_manager',
      'order_manager'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE parcel_status AS ENUM (
      'created',
      'in_transit',
      'delivered',
      'returned',
      'lost'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Создаем таблицу profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  telegram_id BIGINT UNIQUE,
  role user_role NOT NULL DEFAULT 'client',
  full_name TEXT,
  phone TEXT UNIQUE,
  client_code TEXT UNIQUE,
  username TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Даем права на таблицы
GRANT ALL ON public.profiles TO postgres;
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Создаем индексы
CREATE INDEX IF NOT EXISTS idx_profiles_telegram_id ON profiles(telegram_id);
CREATE INDEX IF NOT EXISTS idx_profiles_client_code ON profiles(client_code);

-- Включаем RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Создаем политики
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Триггер для updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at(); 