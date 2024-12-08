import { Controller, Post, Body, UseGuards, Get, Request, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(loginDto.phoneNumber, loginDto.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('telegram/login')
  async telegramLogin(@Body() telegramAuthDto: TelegramAuthDto): Promise<AuthResponseDto> {
    return this.authService.validateTelegramUser(telegramAuthDto.telegramId);
  }

  @Post('set-password')
  async setPassword(@Body() setPasswordDto: SetPasswordDto): Promise<AuthResponseDto> {
    return this.authService.setPassword(setPasswordDto);
  }

  @Get('check-status')
  async checkStatus(@Query('phone') phone: string) {
    return this.authService.checkUserStatus(phone);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.findById(req.user.sub);
  }
}
