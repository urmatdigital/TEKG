import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { TelegramService } from './services/telegram.service';
import { UserService } from './services/user.service';
import { CommandHandler } from './handlers/command.handler';
import { StartHandler } from './handlers/start.handler';
import { ContactHandler } from './handlers/contact.handler';
import { TextHandler } from './handlers/text.handler';
import { HelpHandler } from './handlers/help.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    TelegramService,
    UserService,
    CommandHandler,
    StartHandler,
    ContactHandler,
    TextHandler,
    HelpHandler,
  ],
  exports: [TelegramService, UserService],
})
export class TelegramModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly telegramService: TelegramService) {}

  async onModuleInit() {
    await this.telegramService.start();
  }

  async onModuleDestroy() {
    await this.telegramService.stop();
  }
}
