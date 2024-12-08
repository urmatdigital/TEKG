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
const user_service_1 = require("./user.service");
let TelegramService = class TelegramService {
    constructor(configService, userService) {
        this.configService = configService;
        this.userService = userService;
        this.webhookPath = '/telegram-webhook';
        this.referralPrefix = 'ref_';
    }
    async start() {
        console.log('[TelegramService] Initializing...');
        const token = this.configService.get('TELEGRAM_BOT_TOKEN');
        if (!token) {
            throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
        }
        console.log('[TelegramService] Creating Telegraf instance...');
        this.bot = new telegraf_1.Telegraf(token);
        this.bot.use((0, telegraf_1.session)());
        const webhookUrl = this.configService.get('TELEGRAM_WEBHOOK_URL');
        if (webhookUrl) {
            await this.bot.telegram.setWebhook(`${webhookUrl}${this.webhookPath}`);
        }
        this.setupHandlers();
        await this.bot.launch();
        console.log('[TelegramService] Bot started successfully');
    }
    getWebhookCallback() {
        return this.bot.webhookCallback(this.webhookPath);
    }
    setupHandlers() {
        this.bot.command('start', async (ctx) => {
            const startPayload = ctx.message.text.split(' ')[1];
            if (startPayload === null || startPayload === void 0 ? void 0 : startPayload.startsWith(this.referralPrefix)) {
                const referralCode = startPayload.replace(this.referralPrefix, '');
                ctx.session = { referralCode };
            }
            const telegramId = ctx.from.id.toString();
            const user = await this.userService.findByTelegramId(telegramId);
            if (user) {
                await ctx.reply('Вы уже зарегистрированы! Используйте кнопку ниже для входа:', {
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
                });
                return;
            }
            await ctx.reply('Добро пожаловать в Tulpar Express! Для регистрации поделитесь своим контактом:', {
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
            });
        });
        this.bot.on('contact', async (ctx) => {
            var _a;
            if (ctx.message.contact.user_id !== ctx.from.id) {
                await ctx.reply('Пожалуйста, отправьте свой собственный контакт');
                return;
            }
            const telegramId = ctx.from.id.toString();
            const phone = ctx.message.contact.phone_number;
            try {
                const referredByUser = ((_a = ctx.session) === null || _a === void 0 ? void 0 : _a.referralCode) ?
                    await this.userService.findByReferralCode(ctx.session.referralCode) :
                    null;
                const user = await this.userService.upsertUser({
                    telegram_id: telegramId,
                    telegram_username: ctx.from.username,
                    telegram_first_name: ctx.from.first_name,
                    telegram_last_name: ctx.from.last_name,
                    phone: phone,
                    referred_by: referredByUser === null || referredByUser === void 0 ? void 0 : referredByUser.id
                });
                await ctx.reply('Спасибо за регистрацию! Теперь вы можете войти:', {
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
                });
            }
            catch (error) {
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
    __metadata("design:paramtypes", [config_1.ConfigService,
        user_service_1.UserService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map