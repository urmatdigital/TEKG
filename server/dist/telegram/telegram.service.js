"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const telegraf_1 = require("telegraf");
let TelegramService = class TelegramService {
    constructor(configService) {
        this.configService = configService;
        const token = this.configService.get('TELEGRAM_BOT_TOKEN');
        if (!token) {
            throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
        }
        this.bot = new telegraf_1.Telegraf(token);
        this.initializeBot();
    }
    initializeBot() {
        this.bot.command('start', async (ctx) => {
            const telegramId = ctx.from.id.toString();
            const chatId = ctx.chat.id.toString();
            await ctx.reply('Добро пожаловать! Вы успешно подключились к боту Tulpar Express.');
        });
        this.bot.launch().catch(err => {
            console.error('Error launching Telegram bot:', err);
        });
    }
    async sendVerificationCode(chatId, code) {
        try {
            await this.bot.telegram.sendMessage(chatId, `Ваш код подтверждения: ${code}`);
            return true;
        }
        catch (error) {
            console.error('Error sending verification code:', error);
            return false;
        }
    }
    async sendMessage(chatId, message) {
        try {
            await this.bot.telegram.sendMessage(chatId, message);
            return true;
        }
        catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map