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
exports.HelpHandler = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const base_handler_1 = require("./base.handler");
let HelpHandler = class HelpHandler extends base_handler_1.BaseHandler {
    constructor(userService) {
        super(userService);
    }
    async handle(ctx) {
        try {
            await ctx.reply('Доступные команды:\n' +
                '/start - Начать регистрацию\n' +
                '/help - Показать это сообщение\n' +
                '/login - Войти в приложение\n' +
                '/password - Изменить пароль');
        }
        catch (error) {
            await this.handleError(ctx, error, 'Ошибка при обработке команды /help:');
        }
    }
};
exports.HelpHandler = HelpHandler;
exports.HelpHandler = HelpHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], HelpHandler);
//# sourceMappingURL=help.handler.js.map