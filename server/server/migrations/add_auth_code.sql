-- Добавляем поле auth_code в таблицу profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS auth_code VARCHAR(255);

-- Создаем индекс для быстрого поиска по auth_code
CREATE INDEX IF NOT EXISTS idx_profiles_auth_code ON profiles(auth_code);

-- Обновляем существующие записи с случайным кодом
UPDATE profiles 
SET auth_code = UPPER(
  SUBSTRING(
    MD5(RANDOM()::TEXT) 
    FROM 1 FOR 6
  )
)
WHERE auth_code IS NULL;

-- Делаем поле обязательным
ALTER TABLE profiles
ALTER COLUMN auth_code SET NOT NULL;