import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { UserService } from '../services/user.service';
import { BaseHandler } from './base.handler';

@Injectable()
export class HelpHandler extends BaseHandler {
  constructor(userService: UserService) {
    super(userService);
  }

  async handle(ctx: Context) {
    try {
      await ctx.reply(
        'Доступные команды:\n' +
        '/start - Начать регистрацию\n' +
        '/help - Показать это сообщение\n' +
        '/login - Войти в приложение\n' +
        '/password - Изменить пароль'
      );
    } catch (error) {
      await this.handleError(ctx, error, 'Ошибка при обработке команды /help:');
    }
  }
}
