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
exports.WebhookDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TelegramUserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 123456789 }),
    __metadata("design:type", Number)
], TelegramUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], TelegramUserDto.prototype, "is_bot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    __metadata("design:type", String)
], TelegramUserDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'john_doe' }),
    __metadata("design:type", String)
], TelegramUserDto.prototype, "username", void 0);
class TelegramChatDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 123456789 }),
    __metadata("design:type", Number)
], TelegramChatDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'private', enum: ['private', 'group', 'supergroup', 'channel'] }),
    __metadata("design:type", String)
], TelegramChatDto.prototype, "type", void 0);
class TelegramMessageDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], TelegramMessageDto.prototype, "message_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TelegramUserDto }),
    __metadata("design:type", TelegramUserDto)
], TelegramMessageDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TelegramChatDto }),
    __metadata("design:type", TelegramChatDto)
], TelegramMessageDto.prototype, "chat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1638360000 }),
    __metadata("design:type", Number)
], TelegramMessageDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Hello, bot!' }),
    __metadata("design:type", String)
], TelegramMessageDto.prototype, "text", void 0);
class TelegramCallbackQueryDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456789' }),
    __metadata("design:type", String)
], TelegramCallbackQueryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TelegramUserDto }),
    __metadata("design:type", TelegramUserDto)
], TelegramCallbackQueryDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'button_click' }),
    __metadata("design:type", String)
], TelegramCallbackQueryDto.prototype, "data", void 0);
class WebhookDto {
}
exports.WebhookDto = WebhookDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'message' }),
    __metadata("design:type", String)
], WebhookDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: TelegramMessageDto }),
    __metadata("design:type", TelegramMessageDto)
], WebhookDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: TelegramCallbackQueryDto }),
    __metadata("design:type", TelegramCallbackQueryDto)
], WebhookDto.prototype, "callback_query", void 0);
//# sourceMappingURL=webhook.dto.js.map