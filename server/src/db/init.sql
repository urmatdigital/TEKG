-- Создание enum типов
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE parcel_status AS ENUM ('REGISTERED', 'IN_TRANSIT', 'ARRIVED', 'DELIVERED');

-- Создание таблицы users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  telegram_id VARCHAR(255) UNIQUE,
  role user_role DEFAULT 'USER',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы parcels
CREATE TABLE IF NOT EXISTS parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_number VARCHAR(255) UNIQUE NOT NULL,
  status parcel_status DEFAULT 'REGISTERED',
  description TEXT,
  weight DECIMAL,
  price DECIMAL,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов
CREATE INDEX IF NOT EXISTS idx_parcels_user_id ON parcels(user_id);
CREATE INDEX IF NOT EXISTS idx_parcels_track_number ON parcels(track_number); 