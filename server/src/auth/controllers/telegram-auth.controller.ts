import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { createHmac } from 'crypto';
import { z } from 'zod';
import { UserService } from '../../telegram/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const TelegramAuthDataSchema = z.object({
  id: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
  auth_date: z.number(),
  hash: z.string()
});

type TelegramAuthData = z.infer<typeof TelegramAuthDataSchema>;

@Controller('auth/telegram')
export class TelegramAuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async telegramLogin(@Body() data: TelegramAuthData) {
    try {
      // Validate input data
      const validData = TelegramAuthDataSchema.parse(data);
      
      // Check if the auth_date is not too old (within 24 hours)
      const now = Math.floor(Date.now() / 1000);
      if (now - validData.auth_date > 86400) {
        throw new UnauthorizedException('Authentication data is expired');
      }

      // Verify Telegram authentication data
      const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
      if (!this.verifyTelegramAuth(validData, botToken)) {
        throw new UnauthorizedException('Invalid Telegram authentication');
      }

      // Find or create user
      const user = await this.userService.findByTelegramId(validData.id);
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new UnauthorizedException('Invalid data format');
      }
      throw error;
    }
  }

  private verifyTelegramAuth(data: TelegramAuthData, botToken: string): boolean {
    // Create data check string
    const { hash, ...checkData } = data;
    const checkString = Object.entries(checkData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key
    const secretKey = createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate hash
    const calculatedHash = createHmac('sha256', secretKey)
      .update(checkString)
      .digest('hex');

    // Verify hash
    return calculatedHash === hash;
  }
}
