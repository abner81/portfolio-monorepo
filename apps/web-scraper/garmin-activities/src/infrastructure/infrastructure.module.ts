import { Module } from '@nestjs/common';
import { ApplicationModule } from '@application/application.module';
import { INJECTION_TOKENS } from '@shared/constants/injection-tokens';
import { ScrapeActivitiesHandler } from '@application/use-cases/scrape-activities/scrape-activities.handler';
import { GarminController } from '@infrastructure/adapters/driving/http/garmin.controller';
import { PlaywrightModule } from '@infrastructure/adapters/driven/playwright/playwright.module';
import { InMemoryActivityRepository } from '@infrastructure/adapters/driven/persistence/in-memory-activity.repository';

@Module({
  imports: [ApplicationModule, PlaywrightModule],
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
