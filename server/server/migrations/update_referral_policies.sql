-- Обновляем политики для referral_transactions
DROP POLICY IF EXISTS "Users can view their own referral transactions" ON referral_transactions;
DROP POLICY IF EXISTS "System can insert referral transactions" ON referral_transactions;

-- Разрешаем пользователям просматривать свои транзакции
CREATE POLICY "Enable read access for users" ON referral_transactions
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = referrer_id OR 
        auth.uid() = referred_id
    );

-- Разрешаем сервису создавать транзакции
CREATE POLICY "Enable insert for service role" ON referral_transactions
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Добавляем индекс для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_referral_transactions_referrer_id ON referral_transactions(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_transactions_referred_id ON referral_transactions(referred_id);

-- Обновляем RLS
ALTER TABLE referral_transactions FORCE ROW LEVEL SECURITY;

-- Даем права на чтение аутентифицированным пользователям
GRANT SELECT ON referral_transactions TO authenticated;
GRANT INSERT ON referral_transactions TO service_role; 