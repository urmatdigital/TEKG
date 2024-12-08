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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramAuthController = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const user_service_1 = require("../../telegram/services/user.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let TelegramAuthController = class TelegramAuthController {
    constructor(userService, jwtService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async telegramLogin(data) {
        const botToken = this.configService.get('TELEGRAM_BOT_TOKEN');
        if (!this.verifyTelegramAuth(data, botToken)) {
            throw new common_1.UnauthorizedException('Invalid Telegram authentication');
        }
        const user = await this.userService.findByTelegramId(data.id);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const token = this.jwtService.sign({
            sub: user.id,
            telegram_id: user.telegram_id,
        });
        return {
            token,
            user: {
                id: user.id,
                telegram_id: user.telegram_id,
                client_code: user.client_code,
                phone: user.phone,
                referral_code: user.referral_code,
                referral_balance: user.referral_balance,
                cashback_balance: user.cashback_balance,
            }
        };
    }
    verifyTelegramAuth(data, botToken) {
        const { hash } = data, authData = __rest(data, ["hash"]);
        const dataCheckArr = Object.keys(authData)
            .sort()
            .map(key => `${key}=${authData[key]}`)
            .join('\n');
        const secretKey = (0, crypto_1.createHmac)('sha256', 'WebAppData')
            .update(botToken)
            .digest();
        const expectedHash = (0, crypto_1.createHmac)('sha256', secretKey)
            .update(dataCheckArr)
            .digest('hex');
        return expectedHash === hash;
    }
};
exports.TelegramAuthController = TelegramAuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramAuthController.prototype, "telegramLogin", null);
exports.TelegramAuthController = TelegramAuthController = __decorate([
    (0, common_1.Controller)('auth/telegram'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService])
], TelegramAuthController);
//# sourceMappingURL=telegram-auth.controller.js.map