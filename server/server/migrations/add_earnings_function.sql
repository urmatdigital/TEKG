CREATE OR REPLACE FUNCTION get_total_earnings(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(amount)::INTEGER
         FROM referral_transactions
         WHERE referrer_id = user_id),
        0
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Даем права на выполнение функции
GRANT EXECUTE ON FUNCTION get_total_earnings(UUID) TO authenticated; 