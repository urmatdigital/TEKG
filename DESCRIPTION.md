# TULPAR EXPRESS - Сервис Отслеживания Посылок

<div align="center">

![Tulpar Express Logo](assets/logo.svg)

Современный веб-сервис для отслеживания посылок с интеграцией Telegram и расширенными функциями администрирования.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[Демо](https://demo.tulparexpress.com) · [Документация](docs/README.md) · [Сообщить о баге](issues/new)

</div>

## ✨ Описание Проекта

**TULPAR EXPRESS** представляет собой современное комплексное решение для управления и отслеживания посылок. Система разработана с фокусом на удобство использования и адаптивный дизайн, поддерживающий как светлую, так и темную темы оформления.

## 🎨 Дизайн и Пользовательский Интерфейс

- **Адаптивный Дизайн**: Оптимизация для всех устройств от мобильных до десктопа
- **Поддержка Тем**:
  - 🌞 Светлая тема
  - 🌙 Темная тема
  - Автоматическое определение системных предпочтений
- **Современный UI/UX**:
  - Плавные анимации и переходы
  - Skeleton загрузка
  - Отзывчивый интерфейс
  - Доступность (WCAG 2.1)

## 🚀 Основные Возможности

- **Регистрация и Аутентификация через Telegram**
  - Упрощенный процесс регистрации
  - Безопасная авторизация
  - Интеграция с Telegram ботом
  
- **Персональный Кабинет Клиента**
  - Уникальный код клиента
  - Интерактивное отслеживание посылок
  - Умный калькулятор стоимости доставки
  - Облачное хранение документов

- **Административная Панель**
  - Настраиваемые дашборды
  - Интерактивная аналитика
  - Управление пользователями
  - Конфигурация тарифов

## 💻 Технический Стек

### Frontend
- Next.js 15
- Tailwind CSS
- TypeScript
- Telegram Web Apps API

### Backend
- NestJS
- TypeORM
- PostgreSQL
- JWT для авторизации

## Функциональные Модули

1. **Модуль Аутентификации**
   - Интеграция с Telegram
   - Управление сессиями
   - Безопасная авторизация

2. **Модуль Отслеживания**
   - Добавление трек-номеров
   - Автоматическое обновление статусов
   - История отправлений

3. **Модуль Расчета Стоимости**
   - Калькулятор по весу и габаритам
   - Учет специальных тарифов
   - Расчет сроков доставки

4. **Административный Модуль**
   - Управление пользователями
   - Настройка системы
   - Аналитика и отчеты

5. **Складской Модуль**
   - Управление складом
   - Сканирование штрих-кодов
   - Учет товаров

## 📊 Дашборд

<div align="center">

### Светлая тема
![Dashboard Light Theme](assets/dashboard-light.png)

### Темная тема
![Dashboard Dark Theme](assets/dashboard-dark.png)

</div>

### Основные элементы дашборда

#### 📈 Аналитика в реальном времени
- Количество активных отправлений
- Статистика доставок
- Финансовые показатели
- Загруженность складов

#### 🎯 Ключевые метрики
| Метрика | Описание |
|---------|----------|
| 📦 Активные посылки | Количество посылок в пути |
| ⏱️ Среднее время доставки | Статистика по срокам |
| 💰 Доход | Финансовые показатели |
| 📊 Эффективность | Процент своевременных доставок |

## Безопасность

- **Шифрование данных**
  - SSL/TLS шифрование
  - Безопасное хранение паролей
  - Защита персональных данных

- **Авторизация**
  - JWT токены
  - Двухфакторная аутентификация
  - Ограничение попыток входа

- **Мониторинг**
  - Логирование действий
  - Отслеживание подозрительной активности
  - Автоматические уведомления

## Поддержка

- **Техническая поддержка**
  - Telegram: @tulpar_support
  - Email: support@te.kg
  - Время работы: 24/7

- **Документация**
  - Руководство пользователя
  - API документация
  - Инструкции по интеграции
