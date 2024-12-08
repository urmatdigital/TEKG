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
exports.CommandHandler = void 0;
const common_1 = require("@nestjs/common");
const start_handler_1 = require("./start.handler");
const contact_handler_1 = require("./contact.handler");
const text_handler_1 = require("./text.handler");
let CommandHandler = class CommandHandler {
    constructor(startHandler, contactHandler, textHandler) {
        this.startHandler = startHandler;
        this.contactHandler = contactHandler;
        this.textHandler = textHandler;
    }
    async handleStart(ctx) {
        await this.startHandler.handle(ctx);
    }
    async handleContact(ctx) {
        await this.contactHandler.handle(ctx);
    }
    async handleText(ctx) {
        await this.textHandler.handle(ctx);
    }
    async handleCallback(ctx) {
        try {
            const callbackQuery = ctx.callbackQuery;
            if (!(callbackQuery === null || callbackQuery === void 0 ? void 0 : callbackQuery.data))
                return;
            const [action, ...params] = callbackQuery.data.split(':');
            switch (action) {
                case 'login':
                    console.log('Login callback:', params[0]);
                    await ctx.answerCbQuery('Эта функция пока в разработке');
                    break;
                default:
                    console.log('Неизвестный callback:', action);
            }
            await ctx.answerCbQuery();
        }
        catch (error) {
            console.error('Ошибка при обработке callback:', error);
            await ctx.answerCbQuery('Произошла ошибка. Пожалуйста, попробуйте позже.');
        }
    }
};
exports.CommandHandler = CommandHandler;
exports.CommandHandler = CommandHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [start_handler_1.StartHandler,
        contact_handler_1.ContactHandler,
        text_handler_1.TextHandler])
], CommandHandler);
//# sourceMappingURL=command.handler.js.map