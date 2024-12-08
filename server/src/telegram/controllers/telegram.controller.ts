import { Controller, Post, Get, Req, Res, Body, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { TelegramService } from '../services/telegram.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { WebhookDto } from '../dto/webhook.dto';

@ApiTags('Telegram')
@Controller()
@ApiBearerAuth('JWT-auth')
@ApiSecurity('telegram-token', ['TELEGRAM_BOT_TOKEN'])
export class TelegramController {
  private readonly logger = new Logger(TelegramController.name);

  constructor(private readonly telegramService: TelegramService) {}

  @Get('telegram-webhook')
  @ApiOperation({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  async checkWebhook(@Res() res: Response) {
    this.logger.log('Received GET request to check webhook');
    res.status(200).json({
      status: 'ok',
      message: 'Telegram webhook endpoint is active',
      timestamp: new Date().toISOString()
    });
  }

  @Post('telegram-webhook')
  @ApiOperation({
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
  })
  @ApiBody({
    type: WebhookDto,
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  async handleWebhook(@Body() body: WebhookDto, @Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log('Received webhook request');
      this.logger.debug('Webhook body:', body);

      const handleUpdate = this.telegramService.getWebhookCallback();
      await handleUpdate(req, res);
    } catch (error) {
      this.logger.error('Error handling webhook:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error processing update'
      });
    }
  }
}
