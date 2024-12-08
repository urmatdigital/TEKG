# TULPAR EXPRESS

Система регистрации и отслеживания посылок с интеграцией Telegram бота.

## Структура проекта

```
├── client/          # Frontend приложение на Next.js
├── server/          # Backend приложение на NestJS
└── docs/           # Документация проекта
```

## Переменные окружения

### Для backend (.env)
```
PORT=5000
NODE_ENV=production
BASE_URL=https://api.te.kg
DB_HOST=хост-базы-данных
DB_PORT=5432
DB_USERNAME=имя-пользователя-бд
DB_PASSWORD=пароль-бд
DB_DATABASE=имя-базы-данных
TELEGRAM_BOT_TOKEN=токен-телеграм-бота
```

### Для frontend (.env)
```
NEXT_PUBLIC_API_URL=https://api.te.kg
```

## Локальная разработка

1. Клонируйте репозиторий
2. Скопируйте `.env.example` в `.env` и заполните значения
3. Установите зависимости:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
4. Запустите сервера разработки:
   ```bash
   # Терминал 1 (Frontend)
   cd client && npm run dev

   # Терминал 2 (Backend)
   cd server && npm run start:dev
   ```

## Безопасность

- Не коммитьте файлы `.env`
- Храните токен Telegram бота в безопасном месте
- Регулярно обновляйте зависимости

## Основные функции

- Регистрация через Telegram бота
- Установка пароля через веб-интерфейс
- Отслеживание посылок
- Административная панель
- API для интеграции
- Уведомления в Telegram

## Технологии

- Frontend: Next.js, React, TypeScript
- Backend: NestJS, TypeORM, PostgreSQL
- Telegram Bot API
- JWT авторизация

## Поддержка

По всем вопросам обращайтесь:
- Telegram: @urmatdigital
- Email: urmatdigital@gmail.com