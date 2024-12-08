import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TelegramUserDto {
  @ApiProperty({ example: 123456789 })
  id: number;

  @ApiProperty({ example: false })
  is_bot: boolean;

  @ApiProperty({ example: 'John' })
  first_name: string;

  @ApiPropertyOptional({ example: 'john_doe' })
  username?: string;
}

class TelegramChatDto {
  @ApiProperty({ example: 123456789 })
  id: number;

  @ApiProperty({ example: 'private', enum: ['private', 'group', 'supergroup', 'channel'] })
  type: string;
}

class TelegramMessageDto {
  @ApiProperty({ example: 1 })
  message_id: number;

  @ApiProperty({ type: TelegramUserDto })
  from: TelegramUserDto;

  @ApiProperty({ type: TelegramChatDto })
  chat: TelegramChatDto;

  @ApiProperty({ example: 1638360000 })
  date: number;

  @ApiPropertyOptional({ example: 'Hello, bot!' })
  text?: string;
}

class TelegramCallbackQueryDto {
  @ApiProperty({ example: '123456789' })
  id: string;

  @ApiProperty({ type: TelegramUserDto })
  from: TelegramUserDto;

  @ApiProperty({ example: 'button_click' })
  data: string;
}

export class WebhookDto {
  @ApiProperty({ example: 'message' })
  type: string;

  @ApiPropertyOptional({ type: TelegramMessageDto })
  message?: TelegramMessageDto;

  @ApiPropertyOptional({ type: TelegramCallbackQueryDto })
  callback_query?: TelegramCallbackQueryDto;
}
