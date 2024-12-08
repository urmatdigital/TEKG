import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MoySkladModule } from './moysklad/moysklad.module';
import { typeOrmConfig } from './config/typeorm.config';
import { HealthController } from './controllers/health.controller';
import { TelegramModule } from './telegram/telegram.module';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UserModule,
    MoySkladModule,
    TelegramModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
