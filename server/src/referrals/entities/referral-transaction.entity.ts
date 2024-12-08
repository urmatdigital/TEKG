import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

export type TransactionType = 'REFERRAL_BONUS' | 'CASHBACK' | 'ORDER_COMMISSION';

@Entity('referral_transactions')
export class ReferralTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  referred_user_id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'referred_user_id' })
  referred_user?: User;

  @Column({ type: 'uuid', nullable: true })
  order_id?: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order?: Order;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['REFERRAL_BONUS', 'CASHBACK', 'ORDER_COMMISSION']
  })
  type: TransactionType;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
