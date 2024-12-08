import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('legacy_clients')
export class LegacyClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  client_code: string;

  @Column()
  full_name: string;

  @Column()
  phone: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
