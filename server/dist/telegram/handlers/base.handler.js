"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHandler = void 0;
class BaseHandler {
    constructor(userService) {
        this.userService = userService;
    }
    async getTelegramId(ctx) {
        var _a;
        const telegramId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString();
        if (!telegramId) {
            await ctx.reply('Ошибка: не удалось получить ваш Telegram ID');
            return null;
        }
        return telegramId;
    }
    async handleError(ctx, error, message) {
        console.error(message, error);
        await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
}
exports.BaseHandler = BaseHandler;
//# sourceMappingURL=base.handler.js.map