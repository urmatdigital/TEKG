-- Добавляем поле для хранения ID пригласившего пользователя
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);

-- Добавляем поля для статистики
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_earnings INTEGER DEFAULT 0;

-- Создаем индекс для быстрого поиска рефералов
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by); 