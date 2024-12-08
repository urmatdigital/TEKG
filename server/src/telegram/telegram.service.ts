import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
    }
    
    this.bot = new Telegraf(token);
    this.initializeBot();
  }

  private initializeBot() {
    // Handle /start command
    this.bot.command('start', async (ctx) => {
      const telegramId = ctx.from.id.toString();
      const chatId = ctx.chat.id.toString();
      
      // Store telegram info in response
      await ctx.reply('Добро пожаловать! Вы успешно подключились к боту Tulpar Express.');
    });

    // Launch bot
    this.bot.launch().catch(err => {
      console.error('Error launching Telegram bot:', err);
    });
  }

  async sendVerificationCode(chatId: string, code: string) {
    try {
      await this.bot.telegram.sendMessage(
        chatId,
        `Ваш код подтверждения: ${code}`
      );
      return true;
    } catch (error) {
      console.error('Error sending verification code:', error);
      return false;
    }
  }

  async sendMessage(chatId: string, message: string) {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }
}
