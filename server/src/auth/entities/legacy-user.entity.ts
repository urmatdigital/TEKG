import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('legacy_users')
export class LegacyUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  clientCode: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;
}
