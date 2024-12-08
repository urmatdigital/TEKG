import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { Message } from 'telegraf/types';
import { UserService } from '../services/user.service';
import { BaseHandler } from './base.handler';

@Injectable()
export class TextHandler extends BaseHandler {
  constructor(userService: UserService) {
    super(userService);
  }

  async handle(ctx: Context) {
    try {
      const telegramId = await this.getTelegramId(ctx);
      if (!telegramId) return;

      const message = ctx.message as Message.TextMessage;
      const user = await this.userService.findByTelegramId(telegramId);
      
      if (!user) {
        await ctx.reply('Пожалуйста, сначала зарегистрируйтесь с помощью команды /start');
        return;
      }

      if (!user.password) {
        // Если пароль еще не установлен, устанавливаем его
        await this.userService.setPassword(user.id, message.text);
        await ctx.reply('Пароль успешно установлен! Теперь вы можете войти в приложение.');
        return;
      }

      await ctx.reply('Используйте команду /help для списка доступных команд.');
    } catch (error) {
      await this.handleError(ctx, error, 'Ошибка при обработке текстового сообщения:');
    }
  }
}
