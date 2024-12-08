import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByTelegramId(telegramId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { telegramId }
    });
  }

  async findByReferralCode(referralCode: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { referralCode }
    });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(userId, userData);
    return this.userRepository.findOne({
      where: { id: userId }
    });
  }

  async updateReferralBalance(userId: number, amount: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });
    
    if (user) {
      user.referralBalance = (user.referralBalance || 0) + amount;
      await this.userRepository.save(user);
    }
  }

  async setPassword(userId: number, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.update(userId, { password: hashedPassword });
  }
}
