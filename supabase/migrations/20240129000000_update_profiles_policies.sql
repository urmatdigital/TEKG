-- Обновляем политики безопасности и права доступа

-- Сначала удаляем все существующие политики
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by service role" ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be created by service role" ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be updated by service role" ON public.profiles;

-- Даем базовые права для public схемы
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- Даем права на auth схему
GRANT USAGE ON SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO postgres, service_role;

-- Создаем политики для profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Политика для service_role (полный доступ)
CREATE POLICY "Service role has full access"
ON public.profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Политика для аутентифицированных пользователей (только свои данные)
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Политика для анонимных пользователей (только чтение публичных данных)
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT
TO anon
USING (true);

-- Сбрасываем кэш прав доступа
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
