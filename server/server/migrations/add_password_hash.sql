-- Добавляем поле password_hash в таблицу profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_hash TEXT; 