import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { CommandHandler } from '../handlers/command.handler';
import { HelpHandler } from '../handlers/help.handler';
import { UserService } from '../user/user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
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
    this.bot = new Telegraf(token, {
      telegram: {
        webhookReply: true,
        apiRoot: 'https://api.telegram.org',
      },
    });

    // Set up bot commands
    await this.bot.telegram.setMyCommands([
      { command: 'start', description: 'Start registration process' },
      { command: 'help', description: 'Show help information' },
    ]);

    // Handle errors
    this.bot.catch((err, ctx) => {
      console.error(`[TelegramService] Error while handling update ${ctx.updateType}:`, err);
      ctx.reply('Sorry, something went wrong. Please try again.')
        .catch(error => console.error('[TelegramService] Error sending error message:', error));
    });

    // Set up command handlers
    this.setupCommandHandlers();
    this.setupCallbackHandlers();

    // Start bot
    await this.bot.launch();
    console.log('[TelegramService] Bot started successfully');
  }

  private setupCommandHandlers() {
    // Handle /start command with optional referral parameter
    this.bot.command('start', async (ctx) => {
      const startPayload = ctx.message.text.substring(7); // Remove "/start "
      let referralCode = null;

      if (startPayload.startsWith(this.referralPrefix)) {
        referralCode = startPayload.substring(this.referralPrefix.length);
      }

      const user = await this.userService.findByTelegramId(ctx.from.id.toString());
      
      if (user) {
        // User already registered
        const loginLink = await this.generateLoginLink(user.id);
        await ctx.reply('Welcome back! Click the button below to log in:', {
          reply_markup: {
            inline_keyboard: [[
              { text: 'Log In', url: loginLink }
            ]]
          }
        });
        return;
      }

      // Store referral code in session if present
      if (referralCode) {
        ctx.session = { referralCode };
      }

      // New user - start registration
      await ctx.reply('Welcome! To register, please share your contact information:', {
        reply_markup: {
          keyboard: [[
            { text: 'Share Contact', request_contact: true }
          ]],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    });

    // Handle contact sharing
    this.bot.on('contact', async (ctx) => {
      const contact = ctx.message.contact;
      
      if (contact.user_id !== ctx.from.id) {
        await ctx.reply('Please share your own contact information.');
        return;
      }

      const phone = contact.phone_number.startsWith('+') ? contact.phone_number : `+${contact.phone_number}`;
      
      // Check if user exists in legacy database
      const legacyUser = await this.userService.findLegacyUserByPhone(phone);
      const clientCode = legacyUser ? legacyUser.client_code : await this.userService.generateNextClientCode();

      try {
        // Create or update user
        const user = await this.userService.createOrUpdateUser({
          telegram_id: ctx.from.id.toString(),
          telegram_chat_id: ctx.chat.id.toString(),
          telegram_username: ctx.from.username,
          telegram_first_name: ctx.from.first_name,
          telegram_last_name: ctx.from.last_name,
          telegram_photo_url: await this.getUserProfilePhotos(ctx.from.id),
          phone,
          client_code: clientCode,
          referral_code: `TE-${clientCode}`,
          referred_by: ctx.session?.referralCode ? await this.userService.findByReferralCode(ctx.session.referralCode) : null
        });

        // Send password creation button
        await ctx.reply('Great! Now you can create a password for web login or continue using Telegram:', {
          reply_markup: {
            inline_keyboard: [[
              { text: 'Create Password', callback_data: 'create_password' },
              { text: 'Use Telegram Only', callback_data: 'telegram_only' }
            ]]
          }
        });

      } catch (error) {
        console.error('[TelegramService] Error creating user:', error);
        await ctx.reply('Sorry, there was an error during registration. Please try again.');
      }
    });
  }

  private setupCallbackHandlers() {
    this.bot.action('create_password', async (ctx) => {
      await ctx.reply('Please enter your desired password:', {
        reply_markup: { force_reply: true }
      });
    });

    this.bot.action('telegram_only', async (ctx) => {
      const user = await this.userService.findByTelegramId(ctx.from.id.toString());
      const loginLink = await this.generateLoginLink(user.id);
      
      await ctx.reply('You can use this link to log in anytime:', {
        reply_markup: {
          inline_keyboard: [[
            { text: 'Log In', url: loginLink }
          ]]
        }
      });
    });

    // Handle password creation
    this.bot.on('text', async (ctx) => {
      if (ctx.message.reply_to_message?.text?.includes('enter your desired password')) {
        const password = ctx.message.text;
        
        // Validate password
        if (password.length < 8) {
          await ctx.reply('Password must be at least 8 characters long. Please try again:', {
            reply_markup: { force_reply: true }
          });
          return;
        }

        try {
          const user = await this.userService.findByTelegramId(ctx.from.id.toString());
          await this.userService.setPassword(user.id, password);
          
          await ctx.reply('Password set successfully! You can now log in using your phone number and password.', {
            reply_markup: {
              inline_keyboard: [[
                { text: 'Log In', url: process.env.FRONTEND_URL + '/login' }
              ]]
            }
          });
        } catch (error) {
          console.error('[TelegramService] Error setting password:', error);
          await ctx.reply('Sorry, there was an error setting your password. Please try again.');
        }
      }
    });
  }

  private async getUserProfilePhotos(userId: number): Promise<string | null> {
    try {
      const photos = await this.bot.telegram.getUserProfilePhotos(userId, 0, 1);
      if (photos && photos.total_count > 0) {
        const file = await this.bot.telegram.getFile(photos.photos[0][0].file_id);
        return `https://api.telegram.org/file/bot${this.configService.get('TELEGRAM_BOT_TOKEN')}/${file.file_path}`;
      }
      return null;
    } catch (error) {
      console.error('[TelegramService] Error getting user profile photo:', error);
      return null;
    }
  }

  private async generateLoginLink(userId: string): Promise<string> {
    const token = jwt.sign(
      { userId },
      this.configService.get('JWT_SECRET'),
      { expiresIn: '15m' }
    );
    return `${process.env.FRONTEND_URL}/telegram-login?token=${token}`;
  }

  async stop() {
    if (this.bot) {
      await this.bot.stop();
    }
  }
}
