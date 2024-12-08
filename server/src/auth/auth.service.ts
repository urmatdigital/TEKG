import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SetPasswordDto } from './dto/set-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<User>) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: 'user'
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'user'
      }
    };
  }

  async register(userData: Partial<User>) {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;

    return this.login(result);
  }

  async validateTelegramUser(telegramId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { telegramId }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.login(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async setPassword(setPasswordDto: SetPasswordDto): Promise<AuthResponseDto> {
    const { phoneNumber, password } = setPasswordDto;
    const user = await this.userRepository.findOne({
      where: { phoneNumber }
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    const payload = { sub: user.id, phone: user.phoneNumber };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'user'
      }
    };
  }

  async checkUserStatus(phone: string) {
    const user = await this.userRepository.findOne({
      where: { phoneNumber: phone }
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      hasPassword: !!user.password,
      isRegistered: true,
    };
  }
}
