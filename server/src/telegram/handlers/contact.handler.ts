import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { UserService } from '../services/user.service';
import { User } from '../../auth/entities/user.entity';
import { generateReferralCode } from '../../utils/referral';

interface SessionData {
  referralCode?: string;
  step?: string;
}

interface MyContext extends Context {
  session?: SessionData;
}

@Injectable()
export class ContactHandler {
  constructor(private readonly userService: UserService) {}

  async handle(ctx: MyContext) {
    if (!ctx.message || !('contact' in ctx.message)) {
      await ctx.reply('Пожалуйста, поделитесь контактом через специальную кнопку.');
      return;
    }

    const contact = ctx.message.contact;
    const telegramId = ctx.from?.id.toString();

    if (!telegramId) {
      await ctx.reply('Не удалось получить ваш Telegram ID. Пожалуйста, попробуйте позже.');
      return;
    }

    try {
      // Генерируем коды для нового пользователя
      const clientCode = await this.userService.generateNextClientCode();
      const referralCode = generateReferralCode();

      // Создаем или обновляем пользователя
      const user = await this.userService.createOrUpdateUser({
        telegram_id: telegramId,
        telegram_chat_id: ctx.chat?.id.toString() || '',
        telegram_username: ctx.from?.username,
        telegram_first_name: ctx.from?.first_name,
        telegram_last_name: ctx.from?.last_name,
        phone: contact.phone_number,
        client_code: clientCode,
        referral_code: referralCode,
        referred_by: ctx.session?.referralCode
      });

      // Отправляем приветственное сообщение
      await ctx.reply(
        `Спасибо за регистрацию!\n\n` +
        `Ваш код клиента: ${clientCode}\n` +
        `Ваш реферальный код: ${referralCode}\n\n` +
        'Теперь вам нужно установить пароль для входа в личный кабинет.'
      );

      // Переходим к установке пароля
      if (ctx.session) {
        ctx.session.step = 'WAITING_PASSWORD';
      }
    } catch (error) {
      console.error('Error handling contact:', error);
      await ctx.reply('Произошла ошибка при обработке контакта. Пожалуйста, попробуйте позже.');
    }
  }
}
