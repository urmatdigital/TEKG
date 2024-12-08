import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { UserService } from '../services/user.service';
import { BaseHandler } from './base.handler';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StartHandler extends BaseHandler {
  private readonly clientUrl: string;

  constructor(
    userService: UserService,
    private configService: ConfigService
  ) {
    super(userService);
    // Всегда используем безопасный URL
    this.clientUrl = 'https://te.kg';
  }

  async handle(ctx: Context) {
    try {
      const telegramId = await this.getTelegramId(ctx);
      if (!telegramId) return;

      const user = await this.userService.findByTelegramId(telegramId);
      if (user) {
        // Показываем только кнопку входа через Telegram
        await ctx.reply(
          'Вы уже зарегистрированы! Нажмите кнопку для входа:',
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '📱 Войти через Telegram',
                    callback_data: `login:${user.phoneNumber}`
                  }
                ]
              ]
            }
          }
        );
        return;
      }

      await ctx.reply(
        'Добро пожаловать! Для регистрации, пожалуйста, поделитесь своим контактом, нажав на кнопку ниже.',
        {
          reply_markup: {
            keyboard: [[{ text: '📱 Поделиться контактом', request_contact: true }]],
            resize_keyboard: true,
          },
        }
      );
    } catch (error) {
      console.error('Ошибка при обработке команды /start:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже или обратитесь в поддержку.');
    }
  }
}
