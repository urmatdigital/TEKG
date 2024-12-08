import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('TULPAR EXPRESS API')
    .setDescription('API документация для сервиса TULPAR EXPRESS')
    .setVersion('1.0')
    .addTag('Аутентификация', 'Методы для работы с аутентификацией')
    .addTag('МойСклад', 'Методы для работы с API МойСклад')
    .addTag('Пользователи', 'Методы для работы с пользователями')
    .addTag('Рефералы', 'Методы для работы с реферальной системой')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
