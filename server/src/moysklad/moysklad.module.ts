import { Module } from '@nestjs/common';
import { MoySkladController } from './controllers/moysklad.controller';
import { MoySkladService } from './services/moysklad.service';

@Module({
  controllers: [MoySkladController],
  providers: [MoySkladService],
  exports: [MoySkladService]
})
export class MoySkladModule {}
