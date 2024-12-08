import { DataSource, DataSourceOptions } from "typeorm"
import { config } from "dotenv"
import { join } from "path"
import { CreateBasicTables1701960000000 } from "../migrations/1701960000000-CreateBasicTables"

config({ path: join(__dirname, '../../.env') })

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ["dist/**/*.entity.js"],
  migrations: [CreateBasicTables1701960000000],
  synchronize: false,
}

export const AppDataSource = new DataSource(dataSourceOptions)

// Для отладки
console.log('Database configuration:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  env: process.env.NODE_ENV
})