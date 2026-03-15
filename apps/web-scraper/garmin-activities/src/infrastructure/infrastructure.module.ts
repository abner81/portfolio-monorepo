import { Module } from '@nestjs/common';
import { ApplicationModule } from 'garmin-activities/application/application.module';
import { INJECTION_TOKENS } from 'garmin-activities/shared/constants/injection-tokens';
import { ScrapeActivitiesHandler } from 'garmin-activities/application/use-cases/scrape-activities/scrape-activities.handler';
import { GarminController } from 'garmin-activities/infra/adapters/driving/http/garmin.controller';
import { PlaywrightModule } from 'garmin-activities/infra/adapters/driven/playwright/playwright.module';
import { InMemoryActivityRepository } from 'garmin-activities/infra/adapters/driven/persistence/in-memory-activity.repository';
import { PrismaModule } from 'garmin-activities/infra/adapters/prisma/prisma.module';

@Module({
  imports: [ApplicationModule, PlaywrightModule, PrismaModule],
  controllers: [GarminController],
  providers: [
    ScrapeActivitiesHandler,
    {
      provide: INJECTION_TOKENS.SCRAPE_ACTIVITIES_USE_CASE,
      useExisting: ScrapeActivitiesHandler,
    },
    InMemoryActivityRepository,
    {
      provide: INJECTION_TOKENS.ACTIVITY_REPOSITORY_PORT,
      useExisting: InMemoryActivityRepository,
    },
  ],
  exports: [INJECTION_TOKENS.SCRAPE_ACTIVITIES_USE_CASE],
})
export class InfrastructureModule {}
