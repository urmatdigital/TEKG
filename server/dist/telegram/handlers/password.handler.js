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
exports.PasswordHandler = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
let PasswordHandler = class PasswordHandler {
    constructor(userService) {
        this.userService = userService;
    }
    async getTelegramId(ctx) {
        var _a;
        return ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || null;
    }
    async handleSetPasswordCommand(ctx, phoneNumber) {
        const telegramId = await this.getTelegramId(ctx);
        if (!telegramId)
            return;
        const user = await this.userService.findByTelegramId(telegramId);
        if (!user || user.phoneNumber !== phoneNumber) {
            await ctx.reply('Ошибка: пользователь не найден.');
            return;
        }
        await this.handle(ctx, user);
    }
    async handle(ctx, user) {
        if (!user) {
            await ctx.reply('Пожалуйста, сначала поделитесь своим контактом.');
            return;
        }
        if (!user.phone) {
            await ctx.reply('Пожалуйста, сначала поделитесь своим контактом.');
            return;
        }
        if (user.password) {
            await ctx.reply('У вас уже установлен пароль. Если вы хотите его изменить, воспользуйтесь соответствующей функцией в личном кабинете.');
            return;
        }
        await ctx.reply('Пожалуйста, установите пароль для вашего аккаунта.\n' +
            'Пароль должен содержать минимум 8 символов, включая буквы и цифры.');
        if (ctx.session) {
            ctx.session.step = 'WAITING_PASSWORD';
        }
    }
    async handleText(ctx) {
        var _a;
        const telegramId = await this.getTelegramId(ctx);
        if (!telegramId)
            return;
        const user = await this.userService.findByTelegramId(telegramId);
        if (!user) {
            await ctx.reply('Ошибка: пользователь не найден.');
            return;
        }
        if (((_a = ctx.session) === null || _a === void 0 ? void 0 : _a.step) === 'WAITING_PASSWORD') {
            await this.handlePassword(ctx, user);
        }
    }
    async handlePassword(ctx, user) {
        if (!ctx.message || !('text' in ctx.message)) {
            await ctx.reply('Пожалуйста, отправьте текстовое сообщение с паролем.');
            return;
        }
        const password = ctx.message.text;
        if (password.length < 8) {
            await ctx.reply('Пароль должен содержать минимум 8 символов. Попробуйте еще раз.');
            return;
        }
        if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
            await ctx.reply('Пароль должен содержать как буквы, так и цифры. Попробуйте еще раз.');
            return;
        }
        try {
            await this.userService.setPassword(user.id, password);
            await ctx.reply('Пароль успешно установлен!\n\n' +
                'Теперь вы можете войти в свой личный кабинет на сайте, используя:\n' +
                `- Номер телефона: ${user.phone}\n` +
                '- Установленный пароль');
            if (ctx.session) {
                ctx.session.step = undefined;
            }
        }
        catch (error) {
            console.error('Error setting password:', error);
            await ctx.reply('Произошла ошибка при установке пароля. Пожалуйста, попробуйте позже.');
        }
    }
};
exports.PasswordHandler = PasswordHandler;
exports.PasswordHandler = PasswordHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], PasswordHandler);
//# sourceMappingURL=password.handler.js.map