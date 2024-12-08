import dotenv from 'dotenv';
import path from 'path';

// Загружаем .env файл
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Определяем типы для конфигурации
interface ServerConfig {
  port: number;
  baseUrl: string;
}

interface TelegramConfig {
  botToken: string;
  webhookDomain?: string;
  webhookPath?: string;
}

interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
}

interface JwtConfig {
  secret: string;
  jwtSecret: string;
}

interface Config {
  server: ServerConfig;
  telegram: TelegramConfig;
  supabase: SupabaseConfig;
  jwt: JwtConfig;
}

// Проверяем обязательные переменные окружения
const requiredEnvVars = [
  'TELEGRAM_BOT_TOKEN',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Создаем конфигурацию
export const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    baseUrl: process.env.BASE_URL || 'http://localhost:5000'
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
    webhookDomain: process.env.TELEGRAM_WEBHOOK_DOMAIN,
    webhookPath: process.env.TELEGRAM_WEBHOOK_PATH
  },
  supabase: {
    url: process.env.SUPABASE_URL!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    jwtSecret: process.env.JWT_SECRET!
  }
};