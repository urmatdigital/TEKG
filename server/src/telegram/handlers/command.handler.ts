import { Injectable } from '@nestjs/common';
import { StartHandler } from './start.handler';
import { ContactHandler } from './contact.handler';
import { TextHandler } from './text.handler';
import { Context } from 'telegraf';

@Injectable()
export class CommandHandler {
  constructor(
    private readonly startHandler: StartHandler,
    private readonly contactHandler: ContactHandler,
    private readonly textHandler: TextHandler,
  ) {}

  async handleStart(ctx: Context) {
    await this.startHandler.handle(ctx);
  }

  async handleContact(ctx: Context) {
    await this.contactHandler.handle(ctx);
  }

  async handleText(ctx: Context) {
    await this.textHandler.handle(ctx);
  }

  async handleCallback(ctx: Context) {
    try {
      const callbackQuery = ctx.callbackQuery as { data: string };
      if (!callbackQuery?.data) return;

      const [action, ...params] = callbackQuery.data.split(':');

      switch (action) {
        case 'login':
          // Обработка входа через Telegram
          console.log('Login callback:', params[0]);
          await ctx.answerCbQuery('Эта функция пока в разработке');
          break;
        default:
          console.log('Неизвестный callback:', action);
      }

      // Отвечаем на callback query, чтобы убрать "часики" с кнопки
      await ctx.answerCbQuery();
    } catch (error) {
      console.error('Ошибка при обработке callback:', error);
      await ctx.answerCbQuery('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  }
}
