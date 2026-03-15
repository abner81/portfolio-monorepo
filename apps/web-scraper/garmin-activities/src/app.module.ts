import { Module } from '@nestjs/common';
import { InfrastructureModule } from 'garmin-activities/infra/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
})
export class AppModule {}
