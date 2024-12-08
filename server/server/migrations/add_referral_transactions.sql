-- Создаем таблицу для реферальных транзакций
CREATE TABLE IF NOT EXISTS referral_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES profiles(id),
  referred_id UUID REFERENCES profiles(id),
  amount INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'completed'
);

-- Добавляем индексы
CREATE INDEX IF NOT EXISTS idx_referral_transactions_referrer ON referral_transactions(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_transactions_referred ON referral_transactions(referred_id);

-- Добавляем поле для баланса в profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS referral_balance INTEGER DEFAULT 0;

-- Создаем представление для получения транзакций рефералов
CREATE OR REPLACE VIEW referral_transactions_view AS
SELECT 
  rt.*,
  p.full_name as referred_name,
  p.client_code as referred_code
FROM referral_transactions rt
JOIN profiles p ON p.id = rt.referred_id;