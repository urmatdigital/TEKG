import { Context } from 'telegraf';
import { UserService } from '../services/user.service';

export abstract class BaseHandler {
  constructor(protected readonly userService: UserService) {}

  protected async getTelegramId(ctx: Context): Promise<string | null> {
    const telegramId = ctx.from?.id.toString();
    if (!telegramId) {
      await ctx.reply('Ошибка: не удалось получить ваш Telegram ID');
      return null;
    }
    return telegramId;
  }

  protected async handleError(ctx: Context, error: any, message: string) {
    console.error(message, error);
    await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
  }
}
