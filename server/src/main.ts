import * as dotenv from 'dotenv';
import { join } from 'path';

// Загружаем переменные окружения в самом начале
const envPath = join(__dirname, '../.env');
console.log('[ENV] Loading environment variables from:', envPath);
dotenv.config({ path: envPath });

// Проверяем, что переменные окружения загружены
console.log('[ENV] Environment variables loaded:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? 'Present' : 'Missing');
console.log('- CLIENT_URL:', process.env.CLIENT_URL);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const start = async () => {
  try {
    console.log('[Server] Starting server...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    // Настраиваем CORS
    const allowedOrigins = [
      'https://te.kg',
      'http://te.kg',
      'https://api.te.kg',
      'http://api.te.kg',
      'http://localhost:3000',
      'http://localhost:5000'
    ];

    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.warn(`[CORS] Blocked request from origin: ${origin}`);
          callback(null, false);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      maxAge: 3600,
    });

    // Добавляем глобальный префикс для всех маршрутов
    app.setGlobalPrefix('api');

    const PORT = process.env.PORT || 5000;
    await app.listen(PORT, () => {
      console.log(`[Server] Server is running on port ${PORT}`);
      console.log(`[Server] Base URL: ${process.env.API_URL || `http://localhost:${PORT}`}`);
    });

  } catch (error) {
    console.error('[Server] Error starting server:', error);
    process.exit(1);
  }
};

start();
