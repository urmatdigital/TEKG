import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('referral_transactions')
export class ReferralTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  referred_user_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  type: 'REFERRAL_BONUS' | 'ORDER_COMMISSION' | 'CASHBACK';

  @Column({ type: 'uuid', nullable: true })
  order_id?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  referred_user: User;
}
