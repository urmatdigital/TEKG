import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: registerDto.email },
        { phone: registerDto.phoneNumber }
      ]
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      ...registerDto,
      phone: registerDto.phoneNumber,
      password: hashedPassword
    });

    await this.userRepository.save(user);
    return this.generateAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { phone: loginDto.phoneNumber }
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async validateLogin(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { phone: loginDto.phoneNumber }
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async findUserByTelegramId(telegramId: string): Promise<User> {
    return this.userRepository.findOne({ where: { telegramId } });
  }

  async setPasswordByTelegramId(telegramId: string, password: string): Promise<AuthResponseDto> {
    const user = await this.findUserByTelegramId(telegramId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    
    await this.userRepository.save(user);
    
    return this.generateAuthResponse(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async checkUserStatus(phone: string) {
    const user = await this.userRepository.findOne({
      where: { phone }
    });

    if (!user) {
      return { exists: false };
    }

    return {
      exists: true,
      hasPassword: !!user.password,
      hasTelegram: !!user.telegramId
    };
  }

  private generateAuthResponse(user: User): AuthResponseDto {
    const token = this.jwtService.sign({ 
      sub: user.id,
      phone: user.phone
    });

    return {
      token,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phone,
        email: user.email
      }
    };
  }
}
