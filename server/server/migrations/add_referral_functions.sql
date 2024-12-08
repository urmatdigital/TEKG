-- Функция для обновления реферального баланса
CREATE OR REPLACE FUNCTION update_referral_balance(user_id UUID, amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET referral_balance = referral_balance + amount,
      total_referral_earnings = total_referral_earnings + amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Функция для начисления комиссии с заказа
CREATE OR REPLACE FUNCTION process_order_commission()
RETURNS TRIGGER AS $$
DECLARE
  referrer_id UUID;
  commission INTEGER;
BEGIN
  -- Получаем реферера
  SELECT referrer_id INTO referrer_id
  FROM profiles
  WHERE id = NEW.user_id;

  IF referrer_id IS NOT NULL THEN
    -- Рассчитываем комиссию (3% от суммы заказа)
    commission := (NEW.amount * 0.03)::INTEGER;

    -- Создаем транзакцию
    INSERT INTO referral_transactions (
      referrer_id,
      referred_id,
      amount,
      type,
      order_id
    ) VALUES (
      referrer_id,
      NEW.user_id,
      commission,
      'order_commission',
      NEW.id
    );

    -- Обновляем баланс реферера
    PERFORM update_referral_balance(referrer_id, commission);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического начисления комиссии
CREATE TRIGGER process_order_commission_trigger
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION process_order_commission(); 