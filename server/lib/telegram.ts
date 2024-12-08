import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

// Хранилище кодов подтверждения
const verificationCodes = new Map<string, { code: string; phone: string }>();

// Генерация 6-значного кода
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Инициализация бота
export function initBot() {
  bot.command('start', async (ctx) => {
    const startPayload = ctx.message.text.split(' ')[1];
    if (startPayload) {
      await ctx.reply('Пожалуйста, поделитесь своим контактом для получения кода подтверждения', {
        reply_markup: {
          keyboard: [[{ text: 'Поделиться контактом', request_contact: true }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    }
  });

  bot.on(message('contact'), async (ctx) => {
    const contact = ctx.message.contact;
    if (contact && contact.phone_number) {
      const code = generateCode();
      const phoneNumber = contact.phone_number.startsWith('+') 
        ? contact.phone_number 
        : `+${contact.phone_number}`;
      
      verificationCodes.set(code, { 
        code, 
        phone: phoneNumber 
      });

      // Удаляем код через 5 минут
      setTimeout(() => {
        verificationCodes.delete(code);
      }, 5 * 60 * 1000);

      await ctx.reply(`Ваш код подтверждения: ${code}`, {
        reply_markup: { remove_keyboard: true },
      });
    }
  });

  bot.launch();
}

// Проверка кода подтверждения
export function verifyCode(code: string): { isValid: boolean; phone?: string } {
  const verification = verificationCodes.get(code);
  if (verification) {
    verificationCodes.delete(code); // Удаляем использованный код
    return { isValid: true, phone: verification.phone };
  }
  return { isValid: false };
}

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
