import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { CommandHandler } from '../handlers/command.handler';
import { HelpHandler } from '../handlers/help.handler';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
  private isRunning: boolean = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly commandHandler: CommandHandler,
    private readonly helpHandler: HelpHandler,
  ) {
    console.log('[TelegramService] Initializing...');
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    console.log('[TelegramService] Bot token present:', !!token);
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
    }
    
    try {
      console.log('[TelegramService] Creating Telegraf instance...');
      this.bot = new Telegraf(token);
      console.log('[TelegramService] Telegraf instance created successfully');
    } catch (error) {
      console.error('[TelegramService] Error creating Telegraf instance:', error);
      throw error;
    }
    
    // Регистрируем обработчики команд
    console.log('[TelegramService] Registering command handlers...');
    this.bot.command('start', (ctx) => this.commandHandler.handleStart(ctx));
    this.bot.command('help', (ctx) => this.helpHandler.handle(ctx));
    this.bot.on('contact', (ctx) => this.commandHandler.handleContact(ctx));
    this.bot.on('text', (ctx) => this.commandHandler.handleText(ctx));
    this.bot.on('callback_query', (ctx) => this.commandHandler.handleCallback(ctx));

    // Глобальный обработчик ошибок
    this.bot.catch((err, ctx) => {
      console.error(`Ошибка для ${ctx.updateType}:`, err);
    });
  }

  async start() {
    try {
      console.log('[TelegramService] Starting bot...');
      
      if (this.isRunning) {
        console.log('[TelegramService] Bot is already running');
        return;
      }

      console.log('[TelegramService] Checking bot token...');
      try {
        const me = await this.bot.telegram.getMe();
        console.log('[TelegramService] Bot info:', me);
      } catch (error) {
        console.error('[TelegramService] Error checking bot token:', error);
        throw error;
      }

      // Удаляем вебхук перед запуском long polling
      console.log('[TelegramService] Deleting webhook...');
      await this.deleteWebhook();
      console.log('[TelegramService] Webhook deleted successfully');

      // Запускаем бота
      console.log('[TelegramService] Launching bot...');
      await this.bot.launch();
      this.isRunning = true;
      console.log('[TelegramService] Bot started successfully');

    } catch (error) {
      console.error('[TelegramService] Error starting bot:', error);
      throw error;
    }
  }

  async stop() {
    try {
      if (!this.isRunning) {
        console.log('Bot is not running');
        return;
      }

      await this.bot.stop();
      this.isRunning = false;
      console.log('Telegram bot stopped successfully');
    } catch (error) {
      console.error('Error stopping Telegram bot:', error);
      throw error;
    }
  }

  getBot(): Telegraf {
    return this.bot;
  }

  async sendMessage(chatId: string | number, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, message);
  }

  async deleteWebhook(): Promise<void> {
    try {
      await this.bot.telegram.deleteWebhook();
    } catch (error) {
      console.error('Error deleting webhook:', error);
      // Игнорируем ошибку, так как вебхук может быть уже удален
    }
  }
}
