import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { Message } from 'telegraf/types';
import { UserService } from '../services/user.service';
import { BaseHandler } from './base.handler';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactHandler extends BaseHandler {
  private readonly clientUrl: string;
  private readonly baseUrl: string;

  constructor(
    userService: UserService,
    private configService: ConfigService
  ) {
    super(userService);
    // В development используем localhost, в production - реальный домен
    this.clientUrl = this.configService.get('NODE_ENV') === 'production' 
      ? 'https://te.kg'
      : 'https://te.kg'; // Временно используем te.kg даже в development
    
    this.baseUrl = this.configService.get('BASE_URL') || 'https://api.te.kg';
  }

  async handle(ctx: Context) {
    try {
      const telegramId = await this.getTelegramId(ctx);
      if (!telegramId) return;

      const message = ctx.message as Message.ContactMessage;
      const contact = message.contact;

      if (!contact || contact.user_id?.toString() !== telegramId) {
        await ctx.reply('Пожалуйста, отправьте свой собственный контакт.');
        return;
      }

      const user = await this.userService.findByTelegramId(telegramId);
      if (user) {
        await ctx.reply('Вы уже зарегистрированы!');
        return;
      }

      // Создаем нового пользователя
      const newUser = await this.userService.createUser({
        telegramId: telegramId,
        phoneNumber: contact.phone_number,
        firstName: contact.first_name,
        lastName: contact.last_name,
      });

      // Создаем URL для установки пароля с учетом API префикса
      const setPasswordUrl = `${this.clientUrl}/api/auth/set-password`;
      const phoneParam = encodeURIComponent(newUser.phoneNumber);

      await ctx.reply(
        'Регистрация почти завершена! Для создания пароля перейдите на сайт, нажав кнопку ниже.',
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🔐 Создать пароль',
                  url: `${setPasswordUrl}?phone=${phoneParam}`
                }
              ]
            ],
            remove_keyboard: true
          }
        }
      );

      // Отправляем дополнительное сообщение с номером телефона
      await ctx.reply(
        `Ваш номер телефона для входа: ${newUser.phoneNumber}\n` +
        'Используйте его вместе с паролем, который вы создадите на сайте.'
      );
    } catch (error) {
      console.error('Ошибка при обработке контакта:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже или обратитесь в поддержку.');
    }
  }
}
