import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralTransaction } from './entities/referral-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReferralTransaction])
  ],
  exports: [TypeOrmModule]
})
export class ReferralsModule {}
