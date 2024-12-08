import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('TE.KG API Documentation')
    .setDescription(`
# TE.KG API Documentation

Добро пожаловать в API документацию TE.KG - платформы для управления Telegram ботами и интеграциями.

## Основные возможности

- 🔐 **Аутентификация**: JWT-based аутентификация с поддержкой Telegram Login
- 👤 **Управление пользователями**: Регистрация, авторизация, профили
- 🤖 **Telegram интеграция**: Webhook обработка, отправка сообщений
- 💰 **Финансы**: Управление балансом, рефералы, кэшбэк
- 📊 **Аналитика**: Статистика использования, метрики

## Начало работы

1. Получите токен через эндпоинт \`/auth/login\`
2. Используйте токен в заголовке \`Authorization: Bearer <token>\`
3. Изучите доступные эндпоинты в разделах ниже

## Структура API

API организовано по следующим модулям:
- Auth: Аутентификация и авторизация
- Users: Управление пользователями
- Telegram: Интеграция с Telegram
- Payments: Платежи и транзакции
- Analytics: Аналитика и статистика

## Статусы ответов

- 200: Успешное выполнение
- 201: Ресурс создан
- 400: Некорректный запрос
- 401: Не авторизован
- 403: Доступ запрещен
- 404: Ресурс не найден
- 500: Внутренняя ошибка сервера

## Rate Limiting

- 100 запросов в минуту для авторизованных пользователей
- 20 запросов в минуту для неавторизованных пользователей

## Поддержка

По всем вопросам обращайтесь:
- Email: support@te.kg
- Telegram: @tekg_support
    `)
    .setVersion('1.0.0')
    .setContact('API Support', 'https://te.kg/support', 'support@te.kg')
    .setLicense('Private', 'https://te.kg/license')
    .addServer('https://api.te.kg', 'Production server')
    .addServer('http://localhost:5000', 'Development server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('Auth', 'Аутентификация и авторизация')
    .addTag('Users', 'Управление пользователями')
    .addTag('Telegram', 'Интеграция с Telegram')
    .addTag('Payments', 'Платежи и транзакции')
    .addTag('Analytics', 'Аналитика и статистика')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [],
    extraModels: [],
    deepScanRoutes: true,
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  });

  document.tags = [
    {
      name: 'Auth',
      description: `
## Аутентификация

Модуль отвечает за:
- Регистрацию пользователей
- Вход через Telegram
- Управление JWT токенами
- Восстановление доступа

### Процесс аутентификации:
1. Получение Telegram данных
2. Верификация данных
3. Генерация JWT токена
4. Обновление токена
      `,
      externalDocs: {
        description: 'Подробная документация по аутентификации',
        url: 'https://te.kg/docs/auth'
      }
    },
    {
      name: 'Users',
      description: `
## Пользователи

Функционал:
- Управление профилями
- Изменение настроек
- Управление балансом
- Реферальная система
- Уровни доступа

### Роли пользователей:
- Admin: Полный доступ
- User: Базовый доступ
- Guest: Ограниченный доступ
      `,
      externalDocs: {
        description: 'Подробная документация по пользователям',
        url: 'https://te.kg/docs/users'
      }
    },
    {
      name: 'Telegram',
      description: `
## Telegram Integration

Возможности:
- Webhook обработка
- Отправка сообщений
- Управление ботами
- Обработка команд
- Интерактивные кнопки

### Webhook Processing:
1. Получение обновлений
2. Валидация данных
3. Обработка команд
4. Отправка ответов
      `,
      externalDocs: {
        description: 'Подробная документация по Telegram интеграции',
        url: 'https://te.kg/docs/telegram'
      }
    },
    {
      name: 'Payments',
      description: `
## Финансовые операции

Функционал:
- Пополнение баланса
- Вывод средств
- История транзакций
- Кэшбэк система
- Реферальные вознаграждения

### Способы оплаты:
- Bank cards
- Crypto
- Electronic wallets
      `,
      externalDocs: {
        description: 'Подробная документация по платежам',
        url: 'https://te.kg/docs/payments'
      }
    },
    {
      name: 'Analytics',
      description: `
## Аналитические данные

Метрики:
- Активность пользователей
- Финансовая статистика
- Эффективность рефералов
- Использование ботов
- Конверсии

### Типы отчетов:
- Daily
- Weekly
- Monthly
- Custom range
      `,
      externalDocs: {
        description: 'Подробная документация по аналитике',
        url: 'https://te.kg/docs/analytics'
      }
    }
  ];

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'TE.KG API Documentation',
    customfavIcon: 'https://te.kg/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 30px 0 }
      .swagger-ui .info .title { font-size: 36px }
      .swagger-ui .info .description { font-size: 16px }
      .swagger-ui .info .markdown p { font-size: 16px }
      .swagger-ui .info .markdown h1 { font-size: 32px }
      .swagger-ui .info .markdown h2 { font-size: 24px }
      .swagger-ui .info .markdown h3 { font-size: 20px }
      .swagger-ui .info .markdown code { font-size: 14px }
      .swagger-ui .info .markdown pre { background-color: #f8f8f8 }
      .swagger-ui .opblock .opblock-summary-description { font-size: 14px }
      .swagger-ui .opblock .opblock-description-wrapper p { font-size: 14px }
      .swagger-ui .opblock .opblock-description-wrapper h4 { font-size: 16px }
      .swagger-ui .opblock .opblock-description-wrapper code { font-size: 14px }
      .swagger-ui .opblock .opblock-description-wrapper pre { background-color: #f8f8f8 }
      .swagger-ui .model-box { background-color: #f8f8f8 }
      .swagger-ui .model { font-size: 14px }
      .swagger-ui .responses-table { font-size: 14px }
      .swagger-ui .parameters-table { font-size: 14px }
      .swagger-ui .scheme-container { background-color: #f8f8f8 }
      .swagger-ui select { background-color: #fff }
      .swagger-ui .btn { background-color: #1a73e8 }
      .swagger-ui .btn:hover { background-color: #1557b0 }
    `,
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
    ],
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      displayRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai'
      }
    },
  });
}
