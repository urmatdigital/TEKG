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
exports.StartHandler = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const config_1 = require("@nestjs/config");
let StartHandler = class StartHandler {
    constructor(userService, configService) {
        this.userService = userService;
        this.configService = configService;
        this.clientUrl = 'https://te.kg';
    }
    async handle(ctx) {
        var _a;
        const telegramId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString();
        if (!telegramId) {
            await ctx.reply('Не удалось получить ваш Telegram ID. Пожалуйста, попробуйте позже.');
            return;
        }
        try {
            const user = await this.userService.findByTelegramId(telegramId);
            if (user && user.phone) {
                await ctx.reply(`Добро пожаловать назад!\n\n` +
                    `Ваш код клиента: ${user.client_code}\n` +
                    `Ваш реферальный код: ${user.referral_code}\n\n` +
                    'Используйте эти данные для входа в личный кабинет.');
            }
            else {
                await ctx.reply('Добро пожаловать! Для регистрации, пожалуйста, поделитесь своим контактом.', {
                    reply_markup: {
                        keyboard: [
                            [{
                                    text: '📱 Поделиться контактом',
                                    request_contact: true
                                }]
                        ],
                        resize_keyboard: true
                    }
                });
            }
        }
        catch (error) {
            console.error('Error handling start command:', error);
            await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
        }
    }
};
exports.StartHandler = StartHandler;
exports.StartHandler = StartHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        config_1.ConfigService])
], StartHandler);
//# sourceMappingURL=start.handler.js.map