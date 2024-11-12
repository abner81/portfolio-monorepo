import { Module } from '@nestjs/common';
import { RentCarApiApplicationService } from './application.service';

@Module({
  controllers: [],
  providers: [RentCarApiApplicationService],
  exports: [RentCarApiApplicationService],
})
export class RentCarApplicationModule {}
