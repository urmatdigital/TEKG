import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { CreateBasicTables1701960000000 } from './migrations/1701960000000-CreateBasicTables';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: [CreateBasicTables1701960000000],
  synchronize: false,
});

export default AppDataSource;
