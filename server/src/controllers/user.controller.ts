import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserService } from '../services/UserService';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.userService.getUserByTelegramId(req.user.telegram_id);
    return {
      id: user.id,
      telegram_id: user.telegram_id,
      name: `${user.first_name} ${user.last_name}`,
      phone: user.phone,
      client_code: user.auth_code,
      photo_url: user.avatar_url
    };
  }
}