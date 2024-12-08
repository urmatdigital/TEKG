import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../auth/entities/user.entity';
import { LegacyUser } from '../auth/entities/legacy-user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CreateBasicTables1701960000000 } from '../migrations/1701960000000-CreateBasicTables';
import { AddUserFields1701959940000 } from '../migrations/1701959940000-AddUserFields';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });

const getSupabaseConfig = () => ({
  type: 'postgres' as const,
  host: process.env.SUPABASE_HOST,
  port: parseInt(process.env.SUPABASE_PORT || '5432', 10),
  username: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASSWORD,
  database: process.env.SUPABASE_DB,
  ssl: process.env.SUPABASE_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
  entities: [User, LegacyUser],
  migrations: [CreateBasicTables1701960000000, AddUserFields1701959940000],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  ...getSupabaseConfig(),
});

// Конфигурация для TypeORM CLI и прямого использования
export const config: DataSourceOptions = {
  ...getSupabaseConfig(),
};

export default new DataSource(config);
