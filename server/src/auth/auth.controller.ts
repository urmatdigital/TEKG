import { Controller, Post, Body, UseGuards, Get, Request, Query, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SetPasswordDto } from './dto/set-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.validateLogin(loginDto);
  }

  @Get('check-status')
  async checkStatus(@Query('phone') phone: string) {
    return this.authService.checkUserStatus(phone);
  }

  @Get('telegram/check-status')
  async checkTelegramStatus(@Query('telegramId') telegramId: string) {
    const user = await this.authService.findUserByTelegramId(telegramId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Если у пользователя нет пароля, отправляем флаг needsPassword
    if (!user.password) {
      return {
        needsPassword: true
      };
    }

    // Если пароль есть, выполняем вход
    const authResult = await this.authService.validateLogin({
      phoneNumber: user.phone,
      password: user.password
    });
    
    return {
      needsPassword: false,
      ...authResult
    };
  }

  @Post('telegram/set-password')
  async setTelegramPassword(@Body() setPasswordDto: SetPasswordDto): Promise<AuthResponseDto> {
    const { telegramId, password } = setPasswordDto;
    return this.authService.setPasswordByTelegramId(telegramId, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.findById(req.user.sub);
  }
}
