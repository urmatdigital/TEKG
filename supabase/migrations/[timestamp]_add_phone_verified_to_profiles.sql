-- Добавляем поле phone_verified
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;

-- Создаем политику доступа для чтения
CREATE POLICY "Users can read their own phone verification status" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Создаем политику доступа для обновления
CREATE POLICY "Users can update their own phone verification status" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id); 