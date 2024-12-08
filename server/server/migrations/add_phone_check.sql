-- Сначала исправляем существующие номера
UPDATE profiles
SET phone = CASE 
  WHEN phone !~ '^\+' AND phone ~ '^996' THEN '+' || phone
  WHEN phone !~ '^\+' AND phone ~ '^0' THEN '+996' || substring(phone from 2)
  WHEN phone !~ '^\+' THEN '+996' || phone
  ELSE phone
END;

-- Затем добавляем проверку
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS phone_format_check;

ALTER TABLE profiles
ADD CONSTRAINT phone_format_check 
CHECK (phone ~ '^\+996[0-9]{9}$');

-- Создаем триггер для автоматического форматирования
CREATE OR REPLACE FUNCTION format_phone()
RETURNS trigger AS $$
BEGIN
  NEW.phone = CASE 
    WHEN NEW.phone !~ '^\+' AND NEW.phone ~ '^996' THEN '+' || NEW.phone
    WHEN NEW.phone !~ '^\+' AND NEW.phone ~ '^0' THEN '+996' || substring(NEW.phone from 2)
    WHEN NEW.phone !~ '^\+' THEN '+996' || NEW.phone
    ELSE NEW.phone
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER format_phone_trigger
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION format_phone();
  