import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { UserService } from '../services/user.service';
import { User } from '../../auth/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StartHandler {
  private readonly clientUrl: string;

  constructor(
    private readonly userService: UserService,
    private configService: ConfigService
  ) {
    // Всегда используем безопасный URL
    this.clientUrl = 'https://te.kg';
  }

  async handle(ctx: Context) {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) {
      await ctx.reply('Не удалось получить ваш Telegram ID. Пожалуйста, попробуйте позже.');
      return;
    }

    try {
      const user = await this.userService.findByTelegramId(telegramId);

      if (user && user.phone) {
        // Пользователь уже зарегистрирован
        await ctx.reply(
          `Добро пожаловать назад!\n\n` +
          `Ваш код клиента: ${user.client_code}\n` +
          `Ваш реферальный код: ${user.referral_code}\n\n` +
          'Используйте эти данные для входа в личный кабинет.'
        );
      } else {
        // Новый пользователь или пользователь без номера телефона
        await ctx.reply(
          'Добро пожаловать! Для регистрации, пожалуйста, поделитесь своим контактом.',
          {
            reply_markup: {
              keyboard: [
                [{
                  text: '📱 Поделиться контактом',
                  request_contact: true
                }]
              ],
              resize_keyboard: true
            }
          }
        );
      }
    } catch (error) {
      console.error('Error handling start command:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  }
}
