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
exports.ContactHandler = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const referral_1 = require("../../utils/referral");
let ContactHandler = class ContactHandler {
    constructor(userService) {
        this.userService = userService;
    }
    async handle(ctx) {
        var _a, _b, _c, _d, _e, _f;
        if (!ctx.message || !('contact' in ctx.message)) {
            await ctx.reply('Пожалуйста, поделитесь контактом через специальную кнопку.');
            return;
        }
        const contact = ctx.message.contact;
        const telegramId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString();
        if (!telegramId) {
            await ctx.reply('Не удалось получить ваш Telegram ID. Пожалуйста, попробуйте позже.');
            return;
        }
        try {
            const clientCode = await this.userService.generateNextClientCode();
            const referralCode = (0, referral_1.generateReferralCode)();
            const user = await this.userService.createOrUpdateUser({
                telegram_id: telegramId,
                telegram_chat_id: ((_b = ctx.chat) === null || _b === void 0 ? void 0 : _b.id.toString()) || '',
                telegram_username: (_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username,
                telegram_first_name: (_d = ctx.from) === null || _d === void 0 ? void 0 : _d.first_name,
                telegram_last_name: (_e = ctx.from) === null || _e === void 0 ? void 0 : _e.last_name,
                phone: contact.phone_number,
                client_code: clientCode,
                referral_code: referralCode,
                referred_by: (_f = ctx.session) === null || _f === void 0 ? void 0 : _f.referralCode
            });
            await ctx.reply(`Спасибо за регистрацию!\n\n` +
                `Ваш код клиента: ${clientCode}\n` +
                `Ваш реферальный код: ${referralCode}\n\n` +
                'Теперь вам нужно установить пароль для входа в личный кабинет.');
            if (ctx.session) {
                ctx.session.step = 'WAITING_PASSWORD';
            }
        }
        catch (error) {
            console.error('Error handling contact:', error);
            await ctx.reply('Произошла ошибка при обработке контакта. Пожалуйста, попробуйте позже.');
        }
    }
};
exports.ContactHandler = ContactHandler;
exports.ContactHandler = ContactHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], ContactHandler);
//# sourceMappingURL=contact.handler.js.map