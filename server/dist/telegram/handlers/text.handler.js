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
exports.TextHandler = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const base_handler_1 = require("./base.handler");
let TextHandler = class TextHandler extends base_handler_1.BaseHandler {
    constructor(userService) {
        super(userService);
    }
    async handle(ctx) {
        try {
            const telegramId = await this.getTelegramId(ctx);
            if (!telegramId)
                return;
            const message = ctx.message;
            const user = await this.userService.findByTelegramId(telegramId);
            if (!user) {
                await ctx.reply('Пожалуйста, сначала зарегистрируйтесь с помощью команды /start');
                return;
            }
            if (!user.password) {
                await this.userService.setPassword(user.id, message.text);
                await ctx.reply('Пароль успешно установлен! Теперь вы можете войти в приложение.');
                return;
            }
            await ctx.reply('Используйте команду /help для списка доступных команд.');
        }
        catch (error) {
            await this.handleError(ctx, error, 'Ошибка при обработке текстового сообщения:');
        }
    }
};
exports.TextHandler = TextHandler;
exports.TextHandler = TextHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], TextHandler);
//# sourceMappingURL=text.handler.js.map