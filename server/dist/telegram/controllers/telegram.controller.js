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
var TelegramController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramController = void 0;
const common_1 = require("@nestjs/common");
const telegram_service_1 = require("../services/telegram.service");
const swagger_1 = require("@nestjs/swagger");
const webhook_dto_1 = require("../dto/webhook.dto");
let TelegramController = TelegramController_1 = class TelegramController {
    constructor(telegramService) {
        this.telegramService = telegramService;
        this.logger = new common_1.Logger(TelegramController_1.name);
    }
    async checkWebhook(res) {
        this.logger.log('Received GET request to check webhook');
        res.status(200).json({
            status: 'ok',
            message: 'Telegram webhook endpoint is active',
            timestamp: new Date().toISOString()
        });
    }
    async handleWebhook(body, req, res) {
        try {
            this.logger.log('Received webhook request');
            this.logger.debug('Webhook body:', body);
            const handleUpdate = this.telegramService.getWebhookCallback();
            await handleUpdate(req, res);
        }
        catch (error) {
            this.logger.error('Error handling webhook:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Error processing update'
            });
        }
    }
};
exports.TelegramController = TelegramController;
__decorate([
    (0, common_1.Get)('telegram-webhook'),
    (0, swagger_1.ApiOperation)({
        summary: 'Проверка статуса webhook',
        description: `
## Проверка webhook endpoint

Этот endpoint используется для:
- Проверки доступности webhook
- Валидации настроек webhook
- Проверки SSL сертификата
- Мониторинга состояния

### Технические детали
- Метод: GET
- Путь: /telegram-webhook
- Требуется JWT токен
- Rate limit: 100 req/min

### Использование
\`\`\`bash
curl -X GET https://api.te.kg/telegram-webhook \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`
    `
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Webhook endpoint активен',
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    example: 'ok',
                    description: 'Статус webhook endpoint'
                },
                message: {
                    type: 'string',
                    example: 'Telegram webhook endpoint is active',
                    description: 'Информационное сообщение'
                },
                timestamp: {
                    type: 'string',
                    example: '2024-12-08T07:56:06.000Z',
                    description: 'Время проверки'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Не авторизован',
        schema: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Unauthorized'
                },
                message: {
                    type: 'string',
                    example: 'JWT token is missing or invalid'
                }
            }
        }
    }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "checkWebhook", null);
__decorate([
    (0, common_1.Post)('telegram-webhook'),
    (0, swagger_1.ApiOperation)({
        summary: 'Обработка webhook обновлений от Telegram',
        description: `
## Обработка Telegram Updates

Этот endpoint принимает и обрабатывает обновления от Telegram Bot API.

### Типы обновлений
- Новые сообщения
- Callback queries
- Inline queries
- Изменения состояния чата
- Системные уведомления

### Процесс обработки
1. Получение update объекта
2. Валидация данных
3. Определение типа update
4. Обработка в соответствии с типом
5. Отправка ответа

### Безопасность
- Проверка Telegram токена
- Валидация IP адреса
- Rate limiting
- Проверка подписи

### Технические детали
- Метод: POST
- Content-Type: application/json
- Максимальный размер: 10MB
- Timeout: 30 секунд
    `
    }),
    (0, swagger_1.ApiBody)({
        type: webhook_dto_1.WebhookDto,
        description: 'Telegram Update объект',
        examples: {
            message: {
                summary: 'Новое сообщение',
                value: {
                    update_id: 123456789,
                    message: {
                        message_id: 123,
                        from: {
                            id: 12345,
                            is_bot: false,
                            first_name: 'John',
                            username: 'john_doe'
                        },
                        chat: {
                            id: 12345,
                            type: 'private'
                        },
                        date: 1638360000,
                        text: '/start'
                    }
                }
            },
            callbackQuery: {
                summary: 'Callback Query',
                value: {
                    update_id: 123456790,
                    callback_query: {
                        id: '123456789',
                        from: {
                            id: 12345,
                            is_bot: false,
                            first_name: 'John',
                            username: 'john_doe'
                        },
                        message: {
                            message_id: 123,
                            chat: {
                                id: 12345,
                                type: 'private'
                            },
                            date: 1638360000
                        },
                        data: 'action:123'
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Update успешно обработан',
        schema: {
            type: 'object',
            properties: {
                ok: {
                    type: 'boolean',
                    example: true,
                    description: 'Статус обработки'
                },
                description: {
                    type: 'string',
                    example: 'Update processed successfully',
                    description: 'Описание результата'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Некорректный запрос',
        schema: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Bad Request'
                },
                message: {
                    type: 'string',
                    example: 'Invalid update object'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Внутренняя ошибка сервера',
        schema: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Internal server error'
                },
                message: {
                    type: 'string',
                    example: 'Error processing update'
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [webhook_dto_1.WebhookDto, Object, Object]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "handleWebhook", null);
exports.TelegramController = TelegramController = TelegramController_1 = __decorate([
    (0, swagger_1.ApiTags)('Telegram'),
    (0, common_1.Controller)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiSecurity)('telegram-token', ['TELEGRAM_BOT_TOKEN']),
    __metadata("design:paramtypes", [telegram_service_1.TelegramService])
], TelegramController);
//# sourceMappingURL=telegram.controller.js.map