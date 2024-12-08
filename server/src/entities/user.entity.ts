import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  clientCode: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  telegramId: string;

  @Column({ nullable: true })
  telegramUsername: string;

  @Column({ nullable: true })
  telegramPhotoUrl: string;

  @Column({ nullable: true })
  referralCode: string;

  @Column({ nullable: true })
  referredBy: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  referralBalance: number;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Геттеры для совместимости с предыдущим кодом
  get first_name(): string {
    return this.firstName;
  }

  get last_name(): string {
    return this.lastName;
  }

  get email(): string | null {
    return null;
  }

  get role(): string {
    return 'USER';
  }

  // Геттеры и сеттеры для работы с паролем
  get password_hash(): string {
    return this.password;
  }

  set password_hash(value: string) {
    this.password = value;
  }
}