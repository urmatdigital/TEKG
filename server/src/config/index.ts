import dotenv from 'dotenv';
import path from 'path';

// Загружаем .env файл
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface Config {
  port: number;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl: boolean;
  };
  cors: {
    origin: string;
    credentials: boolean;
  };
  telegram: {
    token: string;
    webhookUrl: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'tekg',
    ssl: process.env.DB_SSL === 'true'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  },
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN || '',
    webhookUrl: process.env.TELEGRAM_WEBHOOK_URL || ''
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d'
  }
};

// Проверяем обязательные переменные окружения
const requiredEnvVars = [
  'DB_HOST',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
  'TELEGRAM_BOT_TOKEN',
  'JWT_SECRET',
  'CORS_ORIGIN'
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Проверяем корректность URL
try {
  new URL(config.cors.origin);
} catch (error) {
  throw new Error('Invalid URL in configuration');
}

// Проверяем корректность порта
if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
  throw new Error('Invalid port number in configuration');
}