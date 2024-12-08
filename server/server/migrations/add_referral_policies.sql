-- Политики для таблицы referral_transactions
ALTER TABLE referral_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referral transactions"
ON referral_transactions
FOR SELECT
TO authenticated
USING (
  referrer_id = auth.uid() OR 
  referred_id = auth.uid()
);

CREATE POLICY "System can insert referral transactions"
ON referral_transactions
FOR INSERT
TO service_role
WITH CHECK (true);

-- Политики для таблицы profiles (обновим существующие)
CREATE POLICY "Users can view referred profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid() OR 
  referrer_id = auth.uid()
); 