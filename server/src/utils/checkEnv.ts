import { config } from '../config';

export function checkRequiredEnvVars() {
  const missing: string[] = [];

  // Проверяем Supabase
  if (!config.supabase.url) missing.push('SUPABASE_URL');
  if (!config.supabase.serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');

  // Проверяем Telegram
  if (!config.telegram.botToken) missing.push('TELEGRAM_BOT_TOKEN');

  // Проверяем Server
  if (!config.server.baseUrl) missing.push('BASE_URL');

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file'
    );
  }
}