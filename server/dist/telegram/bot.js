"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBot = void 0;
const telegraf_1 = require("telegraf");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const token_1 = require("../utils/token");
const dotenv = __importStar(require("dotenv"));
const path_1 = require("path");
dotenv.config({ path: (0, path_1.join)(__dirname, '../../.env') });
if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN must be provided!');
}
const bot = new telegraf_1.Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.catch((err, ctx) => {
    console.error(`Ошибка для ${ctx.updateType}`, err);
});
bot.command('start', async (ctx) => {
    try {
        const userRepository = (0, typeorm_1.getRepository)(user_entity_1.User);
        const telegramUser = ctx.from;
        if (!telegramUser) {
            await ctx.reply('Произошла ошибка при получении данных пользователя');
            return;
        }
        console.log('Telegram user data:', telegramUser);
        let user = await userRepository.findOne({
            where: { telegramId: telegramUser.id.toString() }
        });
        if (user) {
            user.telegramUsername = telegramUser.username || user.telegramUsername;
            user.firstName = telegramUser.first_name || user.firstName;
            user.lastName = telegramUser.last_name || user.lastName;
            await userRepository.save(user);
            console.log('Updated existing user:', user);
            const token = (0, token_1.generateToken)(user);
            await ctx.reply(`С возвращением, ${user.firstName}! 👋\n\n` +
                'Вы можете использовать наше приложение для:\n' +
                '• Отслеживания посылок 📦\n' +
                '• Просмотра истории заказов 📋\n' +
                '• Управления доставками 🚚\n\n' +
                'Используйте кнопки ниже для навигации.');
        }
        else {
            user = userRepository.create({
                telegramId: telegramUser.id.toString(),
                telegramUsername: telegramUser.username,
                firstName: telegramUser.first_name,
                lastName: telegramUser.last_name,
                isVerified: true,
            });
            await userRepository.save(user);
            console.log('Created new user:', user);
            const token = (0, token_1.generateToken)(user);
            await ctx.reply(`Добро пожаловать, ${user.firstName}! 🎉\n\n` +
                'Теперь вы можете использовать наше приложение для:\n' +
                '• Отслеживания посылок 📦\n' +
                '• Просмотра истории заказов 📋\n' +
                '• Управления доставками 🚚\n\n' +
                'Используйте кнопки ниже для начала работы.');
        }
    }
    catch (error) {
        console.error('Error in /start command:', error);
        await ctx.reply('Произошла ошибка при обработке команды. Пожалуйста, попробуйте позже.');
    }
});
const startBot = async () => {
    try {
        console.log('Starting Telegram bot...');
        console.log('Bot token:', process.env.TELEGRAM_BOT_TOKEN ? 'Present' : 'Missing');
        await bot.launch();
        console.log('🤖 Telegram bot started successfully');
    }
    catch (error) {
        console.error('Error starting Telegram bot:', error);
        throw error;
    }
};
exports.startBot = startBot;
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
//# sourceMappingURL=bot.js.map