import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import * as dotenv from 'dotenv';

// Загружаем переменные окружения в самом начале
const envPath = join(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log('[Server] Environment variables loaded from:', envPath);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? 'Present' : 'Missing');
console.log('- CLIENT_URL:', process.env.CLIENT_URL);

async function bootstrap() {
  try {
    console.log('[Server] Starting server...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    const configService = app.get(ConfigService);
    const port = configService.get('PORT', 5000);

    // Включаем CORS
    app.enableCors();

    // Включаем валидацию
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }));

    // Добавляем health check endpoint без префикса api
    app.getHttpAdapter().get('/health', (req, res) => {
      res.status(200).send('OK');
    });

    // Настраиваем глобальный префикс API
    app.setGlobalPrefix('api', {
      exclude: ['/health'],
    });

    // Подключаем Swagger
    setupSwagger(app);

    // Запускаем сервер
    await app.listen(port, '0.0.0.0');
    console.log(`[Server] Application is running on: http://localhost:${port}`);
    console.log(`[Server] Swagger documentation is available at: http://localhost:${port}/api/docs`);
  } catch (error) {
    console.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
