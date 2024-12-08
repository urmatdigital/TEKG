import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { LegacyClient } from '../auth/entities/legacy-client.entity';
import { ReferralTransaction } from '../auth/entities/referral-transaction.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, LegacyClient, ReferralTransaction],
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  synchronize: false, // В продакшене должно быть false
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
  logging: process.env.NODE_ENV === 'development',
  autoLoadEntities: true
};

export const AppDataSource = new DataSource({
  ...typeOrmConfig,
  type: 'postgres',
});
