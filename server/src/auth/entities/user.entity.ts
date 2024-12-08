import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ unique: true, nullable: true })
  telegram_id?: string;

  @Column({ unique: true, nullable: true })
  telegram_chat_id?: string;

  @Column({ nullable: true })
  telegram_username?: string;

  @Column({ nullable: true })
  telegram_first_name?: string;

  @Column({ nullable: true })
  telegram_last_name?: string;

  @Column({ nullable: true })
  telegram_photo_url?: string;

  @Column({ unique: true })
  client_code: string;

  @Column({ unique: true })
  referral_code: string;

  @Column({ type: 'uuid', nullable: true })
  referred_by?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  referral_balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cashback_balance: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'referred_by' })
  referrer: User;

  @OneToMany(() => User, user => user.referrer)
  referrals: User[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
