import { Telegraf, Context } from 'telegraf';
import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { generateToken } from '../utils/token';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Загружаем переменные окружения
dotenv.config({ path: join(__dirname, '../../.env') });

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN must be provided!');
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Добавляем обработку ошибок
bot.catch((err, ctx) => {
  console.error(`Ошибка для ${ctx.updateType}`, err);
});

// Обработка команды /start
bot.command('start', async (ctx: Context) => {
  try {
    const userRepository = getRepository(User);
    
    // Получаем данные пользователя из Telegram
    const telegramUser = ctx.from;
    if (!telegramUser) {
      await ctx.reply('Произошла ошибка при получении данных пользователя');
      return;
    }

    console.log('Telegram user data:', telegramUser); // Добавляем логирование

    // Ищем пользователя в базе данных
    let user = await userRepository.findOne({
      where: { telegramId: telegramUser.id.toString() }
    });

    if (user) {
      // Если пользователь уже существует, обновляем его данные
      user.telegramUsername = telegramUser.username || user.telegramUsername;
      user.firstName = telegramUser.first_name || user.firstName;
      user.lastName = telegramUser.last_name || user.lastName;
      await userRepository.save(user);

      console.log('Updated existing user:', user); // Добавляем логирование

      const token = generateToken(user);
      await ctx.reply(
        `С возвращением, ${user.firstName}! 👋\n\n` +
        'Вы можете использовать наше приложение для:\n' +
        '• Отслеживания посылок 📦\n' +
        '• Просмотра истории заказов 📋\n' +
        '• Управления доставками 🚚\n\n' +
        'Используйте кнопки ниже для навигации.'
      );
    } else {
      // Создаем нового пользователя
      user = userRepository.create({
        telegramId: telegramUser.id.toString(),
        telegramUsername: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        isVerified: true,
      });
      await userRepository.save(user);

      console.log('Created new user:', user); // Добавляем логирование

      const token = generateToken(user);
      await ctx.reply(
        `Добро пожаловать, ${user.firstName}! 🎉\n\n` +
        'Теперь вы можете использовать наше приложение для:\n' +
        '• Отслеживания посылок 📦\n' +
        '• Просмотра истории заказов 📋\n' +
        '• Управления доставками 🚚\n\n' +
        'Используйте кнопки ниже для начала работы.'
      );
    }

  } catch (error) {
    console.error('Error in /start command:', error);
    await ctx.reply('Произошла ошибка при обработке команды. Пожалуйста, попробуйте позже.');
  }
});

// Запуск бота
export const startBot = async () => {
  try {
    console.log('Starting Telegram bot...'); // Добавляем логирование
    console.log('Bot token:', process.env.TELEGRAM_BOT_TOKEN ? 'Present' : 'Missing'); // Проверяем наличие токена
    
    await bot.launch();
    console.log('🤖 Telegram bot started successfully');
  } catch (error) {
    console.error('Error starting Telegram bot:', error);
    throw error;
  }
};

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
