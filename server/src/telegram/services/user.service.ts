import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { LegacyClient } from '../../auth/entities/legacy-client.entity';
import { ReferralTransaction } from '../../auth/entities/referral-transaction.entity';
import { Order } from '../../orders/entities/order.entity';
import * as bcrypt from 'bcrypt';
import { MoySkladService } from '../../services/moysklad.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LegacyClient)
    private readonly legacyClientRepository: Repository<LegacyClient>,
    @InjectRepository(ReferralTransaction)
    private readonly referralTransactionRepository: Repository<ReferralTransaction>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly moyskladService: MoySkladService
  ) {}

  async findByTelegramId(telegramId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { telegram_id: telegramId }
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { phone }
    });
  }

  async findLegacyUserByPhone(phone: string): Promise<LegacyClient | null> {
    return this.legacyClientRepository.findOne({
      where: { phone }
    });
  }

  async findByReferralCode(referralCode: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { referral_code: referralCode }
    });
  }

  async generateNextClientCode(): Promise<string> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select('MAX(CAST(SUBSTRING(client_code, 4) AS INTEGER))', 'max_code')
      .where("client_code LIKE 'TE-%'")
      .getRawOne();

    const maxCode = result?.max_code || 7000;
    return `TE-${maxCode + 1}`;
  }

  async createUserFromTelegram(data: {
    telegram_id: string;
    telegram_username?: string;
    telegram_first_name?: string;
    telegram_last_name?: string;
    telegram_photo_url?: string;
    phone?: string;
  }): Promise<User> {
    try {
      // Генерируем уникальный код клиента
      const clientCode = await this.generateNextClientCode();

      // Создаем пользователя в базе данных
      const user = this.userRepository.create({
        telegram_id: data.telegram_id,
        telegram_username: data.telegram_username,
        telegram_first_name: data.telegram_first_name,
        telegram_last_name: data.telegram_last_name,
        telegram_photo_url: data.telegram_photo_url,
        phone: data.phone,
        client_code: clientCode,
        referral_code: `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        referral_balance: 0,
        cashback_balance: 0
      });
      await this.userRepository.save(user);

      // Создаем контрагента в МойСклад
      await this.moyskladService.upsertCustomer({
        clientCode: clientCode,
        firstName: data.telegram_first_name || 'Без имени',
        lastName: data.telegram_last_name || 'Без фамилии',
        phone: data.phone || '',
        email: ''
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    await this.userRepository.update(userId, data);
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async updateUserByTelegramId(telegramId: string, data: Partial<User>): Promise<User> {
    await this.userRepository.update({ telegram_id: telegramId }, data);
    return this.findByTelegramId(telegramId);
  }

  async upsertUser(userData: Partial<User>): Promise<User> {
    const existingUser = await this.findByTelegramId(userData.telegram_id);
    
    if (existingUser) {
      // Обновляем существующего пользователя
      await this.userRepository.update(existingUser.id, userData);
      return this.userRepository.findOne({ where: { id: existingUser.id } });
    }

    // Создаем нового пользователя
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async createReferralTransaction(data: {
    userId: string;
    referredUserId: string;
    amount: number;
    type: 'REFERRAL_BONUS' | 'ORDER_COMMISSION' | 'CASHBACK';
    orderId?: string;
  }): Promise<ReferralTransaction> {
    const transaction = this.referralTransactionRepository.create({
      user_id: data.userId,
      referred_user_id: data.referredUserId,
      amount: data.amount,
      type: data.type,
      order_id: data.orderId
    });
    return this.referralTransactionRepository.save(transaction);
  }

  async getReferralTransactions(userId: string): Promise<ReferralTransaction[]> {
    return this.referralTransactionRepository.find({
      where: [
        { user_id: userId },
        { referred_user_id: userId }
      ],
      order: { created_at: 'DESC' },
      relations: ['user', 'referred_user']
    });
  }

  async createOrUpdateUser(data: {
    telegram_id: string;
    telegram_chat_id: string;
    telegram_username?: string;
    telegram_first_name?: string;
    telegram_last_name?: string;
    telegram_photo_url?: string;
    phone: string;
    client_code: string;
    referral_code: string;
    referred_by?: string;
  }): Promise<User> {
    let user = await this.findByTelegramId(data.telegram_id);

    if (user) {
      // Update existing user
      Object.assign(user, data);
      return this.userRepository.save(user);
    }

    // Create new user
    user = this.userRepository.create(data);
    user = await this.userRepository.save(user);

    // Process referral if exists
    if (data.referred_by) {
      const referrer = await this.findByReferralCode(data.referred_by);
      if (referrer) {
        await this.processReferralBonus(referrer, user);
      }
    }

    return user;
  }

  async setPassword(userId: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async processReferralBonus(referrer: User, referred: User): Promise<void> {
    // Add referral bonus
    const referralBonus = 50; // 50 som for each referral
    await this.userRepository.increment(
      { id: referrer.id },
      'referral_balance',
      referralBonus
    );

    // Record the transaction
    await this.referralTransactionRepository.save({
      user_id: referrer.id,
      referred_user_id: referred.id,
      amount: referralBonus,
      type: 'REFERRAL_BONUS'
    });
  }

  async processOrderCommission(order: Order, amount: number): Promise<void> {
    if (!order.user) return;

    // Process cashback for the user (2%)
    const cashbackAmount = amount * 0.02;
    await this.userRepository.increment(
      { id: order.user.id },
      'cashback_balance',
      cashbackAmount
    );

    // Record the transaction
    await this.referralTransactionRepository.save({
      user_id: order.user.id,
      amount: cashbackAmount,
      type: 'CASHBACK',
      order_id: order.id
    });

    // If user was referred, give commission to referrer (1%)
    const referrer = await this.userRepository.findOne({
      where: { id: order.user.referred_by }
    });

    if (referrer) {
      const commissionAmount = amount * 0.01;
      await this.userRepository.increment(
        { id: referrer.id },
        'referral_balance',
        commissionAmount
      );

      // Record the referral commission transaction
      await this.referralTransactionRepository.save({
        user_id: referrer.id,
        referred_user_id: order.user.id,
        amount: commissionAmount,
        type: 'ORDER_COMMISSION',
        order_id: order.id
      });
    }
  }

  async getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    totalReferralBalance: number;
    totalCashbackBalance: number;
    referrals: Array<{
      user: User;
      totalOrders: number;
      registrationDate: Date;
    }>;
  }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['referrals']
    });

    if (!user) {
      throw new Error('User not found');
    }

    const referralsWithStats = await Promise.all(
      user.referrals.map(async (referral) => {
        const totalOrders = await this.orderRepository.count({
          where: { user_id: referral.id }
        });

        return {
          user: referral,
          totalOrders,
          registrationDate: referral.created_at
        };
      })
    );

    return {
      totalReferrals: user.referrals.length,
      totalReferralBalance: user.referral_balance,
      totalCashbackBalance: user.cashback_balance,
      referrals: referralsWithStats
    };
  }
}
