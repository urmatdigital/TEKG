import { IsString, IsOptional, IsPhoneNumber } from 'class-validator';

export class TelegramAuthDto {
  @IsString()
  telegramId: string;
}

export class TelegramPasswordDto {
  @IsString()
  telegramId: string;

  @IsString()
  password: string;
}

export class TelegramLoginDto {
  @IsString()
  telegramId: string;
}
