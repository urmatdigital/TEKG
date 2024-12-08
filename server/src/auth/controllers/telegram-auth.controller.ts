import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../telegram/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('auth/telegram')
export class TelegramAuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async telegramLogin(@Body() data: {
    id: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
  }) {
    // Verify Telegram authentication data
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!this.verifyTelegramAuth(data, botToken)) {
      throw new UnauthorizedException('Invalid Telegram authentication');
    }

    // Find or create user
    const user = await this.userService.findByTelegramId(data.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate JWT token
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

  private verifyTelegramAuth(data: any, botToken: string): boolean {
    const { hash, ...authData } = data;
    const dataCheckArr = Object.keys(authData)
      .sort()
      .map(key => `${key}=${authData[key]}`)
      .join('\n');

    const secretKey = createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const expectedHash = createHmac('sha256', secretKey)
      .update(dataCheckArr)
      .digest('hex');

    return expectedHash === hash;
  }
}
