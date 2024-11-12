import { Module } from '@nestjs/common';
import {
  AddProtectionPlanController,
  EditProtectionPlanController,
} from './controllers';

@Module({
  controllers: [AddProtectionPlanController, EditProtectionPlanController],
})
export class RentModule {}
