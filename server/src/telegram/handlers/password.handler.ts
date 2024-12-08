import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { UserService } from '../services/user.service';
import { BaseHandler } from './base.handler';

@Injectable()
export class PasswordHandler extends BaseHandler {
  private userStates: Map<string, { step: 'waiting_password' | 'waiting_confirmation', password?: string }> = new Map();

  constructor(userService: UserService) {
    super(userService);
  }

  async handleSetPasswordCommand(ctx: Context, phoneNumber: string) {
    const telegramId = await this.getTelegramId(ctx);
    if (!telegramId) return;

    const user = await this.userService.findByTelegramId(telegramId);
    if (!user || user.phoneNumber !== phoneNumber) {
      await ctx.reply('Ошибка: пользователь не найден.');
      return;
    }

    this.userStates.set(telegramId, { step: 'waiting_password' });
    
    await ctx.reply(
      'Пожалуйста, введите новый пароль.\n\n' +
      'Требования к паролю:\n' +
      '- Минимум 8 символов\n' +
      '- Хотя бы одна буква и одна цифра',
      {
        reply_markup: {
          keyboard: [[{ text: '❌ Отменить' }]],
          resize_keyboard: true,
        },
      }
    );
  }

  async handleText(ctx: Context) {
    const telegramId = await this.getTelegramId(ctx);
    if (!telegramId) return;

    const message = ctx.message as { text: string };
    const text = message.text;

    if (text === '❌ Отменить') {
      this.userStates.delete(telegramId);
      await ctx.reply('Установка пароля отменена.', {
        reply_markup: { remove_keyboard: true },
      });
      return;
    }

    const state = this.userStates.get(telegramId);
    if (!state) return;

    if (state.step === 'waiting_password') {
      if (!this.isValidPassword(text)) {
        await ctx.reply(
          'Пароль не соответствует требованиям. Пожалуйста, убедитесь что пароль:\n' +
          '- Содержит минимум 8 символов\n' +
          '- Включает хотя бы одну букву и одну цифру\n\n' +
          'Попробуйте ввести другой пароль:'
        );
        return;
      }

      this.userStates.set(telegramId, { 
        step: 'waiting_confirmation',
        password: text
      });

      await ctx.reply('Пожалуйста, введите пароль ещё раз для подтверждения:');
      return;
    }

    if (state.step === 'waiting_confirmation') {
      if (text !== state.password) {
        await ctx.reply('Пароли не совпадают. Пожалуйста, попробуйте снова:');
        this.userStates.set(telegramId, { step: 'waiting_password' });
        return;
      }

      try {
        const user = await this.userService.findByTelegramId(telegramId);
        if (!user) {
          await ctx.reply('Ошибка: пользователь не найден.');
          return;
        }

        await this.userService.setPassword(user.id, state.password);
        this.userStates.delete(telegramId);

        await ctx.reply(
          '✅ Пароль успешно установлен!\n\n' +
          'Теперь вы можете войти в систему, используя:\n' +
          '- Номер телефона: ' + user.phoneNumber + '\n' +
          '- Установленный пароль',
          {
            reply_markup: { remove_keyboard: true },
          }
        );
      } catch (error) {
        console.error('Ошибка при установке пароля:', error);
        await ctx.reply('Произошла ошибка при установке пароля. Пожалуйста, попробуйте позже.');
      }
    }
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 8 && 
           /[a-zA-Z]/.test(password) && 
           /[0-9]/.test(password);
  }
}
