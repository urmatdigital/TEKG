import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf, Context, session } from 'telegraf';
import { UserService } from './user.service';
import * as jwt from 'jsonwebtoken';

interface SessionData {
  referralCode?: string;
}

interface MyContext extends Context {
  session?: SessionData;
}

@Injectable()
export class TelegramService {
  private bot: Telegraf<MyContext>;
  private readonly webhookPath = '/telegram-webhook';
  private readonly referralPrefix = 'ref_';

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async start() {
    console.log('[TelegramService] Initializing...');
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
    }

    console.log('[TelegramService] Creating Telegraf instance...');
    this.bot = new Telegraf<MyContext>(token);

    // Добавляем middleware для сессий
    this.bot.use(session());

    // Настраиваем вебхук
    const webhookUrl = this.configService.get<string>('TELEGRAM_WEBHOOK_URL');
    if (webhookUrl) {
      await this.bot.telegram.setWebhook(`${webhookUrl}${this.webhookPath}`);
    }

    this.setupHandlers();

    // Запускаем бота
    await this.bot.launch();
    console.log('[TelegramService] Bot started successfully');
  }

  getWebhookCallback() {
    return this.bot.webhookCallback(this.webhookPath);
  }

  private setupHandlers() {
    // Обработчик команды /start
    this.bot.command('start', async (ctx) => {
      const startPayload = ctx.message.text.split(' ')[1];
      if (startPayload?.startsWith(this.referralPrefix)) {
        const referralCode = startPayload.replace(this.referralPrefix, '');
        ctx.session = { referralCode };
      }

      const telegramId = ctx.from.id.toString();
      const user = await this.userService.findByTelegramId(telegramId);

      if (user) {
        await ctx.reply(
          'Вы уже зарегистрированы! Используйте кнопку ниже для входа:',
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🔑 Войти',
                    url: `https://te.kg/auth/telegram?id=${telegramId}`
                  }
                ]
              ]
            }
          }
        );
        return;
      }

      await ctx.reply(
        'Добро пожаловать в Tulpar Express! Для регистрации поделитесь своим контактом:',
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text: '📱 Поделиться контактом',
                  request_contact: true
                }
              ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        }
      );
    });

    // Обработчик получения контакта
    this.bot.on('contact', async (ctx) => {
      if (ctx.message.contact.user_id !== ctx.from.id) {
        await ctx.reply('Пожалуйста, отправьте свой собственный контакт');
        return;
      }

      const telegramId = ctx.from.id.toString();
      const phone = ctx.message.contact.phone_number;

      try {
        // Создаем или обновляем пользователя
        const referredByUser = ctx.session?.referralCode ? 
          await this.userService.findByReferralCode(ctx.session.referralCode) : 
          null;

        const user = await this.userService.upsertUser({
          telegram_id: telegramId,
          telegram_username: ctx.from.username,
          telegram_first_name: ctx.from.first_name,
          telegram_last_name: ctx.from.last_name,
          phone: phone,
          referred_by: referredByUser?.id
        });

        // Отправляем сообщение с кнопкой для входа
        await ctx.reply(
          'Спасибо за регистрацию! Теперь вы можете войти:',
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🔑 Войти',
                    url: `https://te.kg/auth/telegram?id=${telegramId}`
                  }
                ]
              ],
              remove_keyboard: true
            }
          }
        );
      } catch (error) {
        console.error('Error processing contact:', error);
        await ctx.reply('Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.');
      }
    });
  }

  async stop() {
    if (this.bot) {
      await this.bot.stop();
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
