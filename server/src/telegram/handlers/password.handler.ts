import { Context } from 'telegraf';
import { UserService } from '../services/user.service';
import { User } from '../../auth/entities/user.entity';

interface SessionData {
  step?: string;
}

interface MyContext extends Context {
  session?: SessionData;
}

export class PasswordHandler {
  constructor(private readonly userService: UserService) {}

  private async getTelegramId(ctx: MyContext): Promise<string | null> {
    return ctx.from?.id.toString() || null;
  }

  async handleSetPasswordCommand(ctx: MyContext, user: User) {
    if (!user) {
      await ctx.reply('Пожалуйста, сначала поделитесь своим контактом.');
      return;
    }

    if (!user.phone) {
      await ctx.reply('Пожалуйста, сначала поделитесь своим контактом.');
      return;
    }

    await this.handle(ctx, user);
  }

  async handle(ctx: MyContext, user: User) {
    if (!user) {
      await ctx.reply('Пожалуйста, сначала поделитесь своим контактом.');
      return;
    }

    if (!user.phone) {
      await ctx.reply('Пожалуйста, сначала поделитесь своим контактом.');
      return;
    }

    // Проверяем, есть ли у пользователя пароль
    if (user.password) {
      await ctx.reply('У вас уже установлен пароль. Если вы хотите его изменить, воспользуйтесь соответствующей функцией в личном кабинете.');
      return;
    }

    // Отправляем сообщение с просьбой установить пароль
    await ctx.reply(
      'Пожалуйста, установите пароль для вашего аккаунта.\n' +
      'Пароль должен содержать минимум 8 символов, включая буквы и цифры.'
    );

    // Устанавливаем следующий шаг - ожидание пароля
    if (ctx.session) {
      ctx.session.step = 'WAITING_PASSWORD';
    }
  }

  async handleText(ctx: MyContext) {
    const telegramId = await this.getTelegramId(ctx);
    if (!telegramId) return;

    const user = await this.userService.findByTelegramId(telegramId);
    if (!user) {
      await ctx.reply('Ошибка: пользователь не найден.');
      return;
    }

    if (ctx.session?.step === 'WAITING_PASSWORD') {
      await this.handlePassword(ctx, user);
    }
  }

  async handlePassword(ctx: MyContext, user: User) {
    if (!ctx.message || !('text' in ctx.message)) {
      await ctx.reply('Пожалуйста, отправьте текстовое сообщение с паролем.');
      return;
    }

    const password = ctx.message.text;

    // Проверяем требования к паролю
    if (password.length < 8) {
      await ctx.reply('Пароль должен содержать минимум 8 символов. Попробуйте еще раз.');
      return;
    }

    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      await ctx.reply('Пароль должен содержать как буквы, так и цифры. Попробуйте еще раз.');
      return;
    }

    try {
      // Устанавливаем пароль
      await this.userService.setPassword(user.id, password);

      // Отправляем сообщение об успешной установке пароля
      await ctx.reply(
        'Пароль успешно установлен!\n\n' +
        'Теперь вы можете войти в свой личный кабинет на сайте, используя:\n' +
        `- Номер телефона: ${user.phone}\n` +
        '- Установленный пароль'
      );

      // Сбрасываем шаг
      if (ctx.session) {
        ctx.session.step = undefined;
      }
    } catch (error) {
      console.error('Error setting password:', error);
      await ctx.reply('Произошла ошибка при установке пароля. Пожалуйста, попробуйте позже.');
    }
  }
}
