-- Добавляем поля для реферальной системы в profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_balance INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS referrer_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS total_referral_earnings INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_orders_amount INTEGER DEFAULT 0;

-- Создаем enum для статусов
CREATE TYPE user_status AS ENUM (
  'newcomer',      -- Новичок (0-5 рефералов)
  'courier',       -- Курьер (5-15 рефералов)
  'dispatcher',    -- Диспетчер (15-30 рефералов)
  'logistician',   -- Логист (30-50 рефералов)
  'manager',       -- Менеджер (50-100 рефералов)
  'director'       -- Директор (100+ рефералов)
);

-- Добавляем поле статуса
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'newcomer';

-- Создаем таблицу для заказов
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создаем таблицу для реферальных начислений
CREATE TABLE IF NOT EXISTS referral_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES profiles(id),
  referred_id UUID REFERENCES profiles(id),
  amount INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'signup_bonus' или 'order_commission'
  order_id UUID REFERENCES orders(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Функция для обновления статуса пользователя
CREATE OR REPLACE FUNCTION update_user_status()
RETURNS TRIGGER AS $$
DECLARE
  referral_count INTEGER;
BEGIN
  -- Получаем количество рефералов
  SELECT COUNT(*) INTO referral_count
  FROM profiles
  WHERE referrer_id = NEW.id;

  -- Обновляем статус
  NEW.status = CASE
    WHEN referral_count >= 100 THEN 'director'
    WHEN referral_count >= 50 THEN 'manager'
    WHEN referral_count >= 30 THEN 'logistician'
    WHEN referral_count >= 15 THEN 'dispatcher'
    WHEN referral_count >= 5 THEN 'courier'
    ELSE 'newcomer'
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обновления статуса
CREATE TRIGGER update_profile_status
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_status(); 