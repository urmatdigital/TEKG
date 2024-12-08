-- Удаляем существующую таблицу migrations если она есть
DROP TABLE IF EXISTS migrations;

-- Создаем новую таблицу migrations с правильной структурой
CREATE TABLE migrations (
    id SERIAL PRIMARY KEY,
    timestamp BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- Создаем индекс для ускорения поиска
CREATE INDEX idx_migrations_timestamp ON migrations(timestamp);

-- Добавляем базовую миграцию
INSERT INTO migrations (timestamp, name) VALUES (1701958175000, 'InitialSetup1701958175000');

-- Предоставляем необходимые права
GRANT ALL PRIVILEGES ON TABLE migrations TO postgres;
GRANT USAGE, SELECT ON SEQUENCE migrations_id_seq TO postgres;
