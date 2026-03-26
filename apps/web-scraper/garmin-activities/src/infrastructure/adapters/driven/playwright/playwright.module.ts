import { Module } from '@nestjs/common';
import { INJECTION_TOKENS } from 'garmin-activities/shared/constants/injection-tokens';
import { GarminPlaywrightScraper } from 'garmin-activities/infra/adapters/driven/playwright/garmin-playwright.scraper';
import { GarminScraperComposite } from './scraper-composite/garmin-scraper-composite';
import { SleepScraper } from './scraper-composite/scrapers/sleep/sleep-scraper';
import {
  BodyBatteryScraper,
  HomeScraper,
  StressScraper,
  ActivitiesScraper,
} from './scraper-composite/scrapers';
import { ActivityReportScraper } from './scraper-composite/scrapers/activity-report/activity-report-scraper';

@Module({
  providers: [
    GarminPlaywrightScraper,
    SleepScraper,
    BodyBatteryScraper,
    {
      provide: INJECTION_TOKENS.GARMIN_SCRAPER_COMPOSITE,
      useClass: GarminScraperComposite,
    },
    {
      provide: INJECTION_TOKENS.BROWSER_SCRAPER_PORT,
      useExisting: GarminPlaywrightScraper,
    },
    {
      provide: INJECTION_TOKENS.BODY_BATTERY_SCRAPER,
      useClass: BodyBatteryScraper,
    },
    {
      provide: INJECTION_TOKENS.SLEEP_SCRAPER,
      useClass: SleepScraper,
    },
    {
      provide: INJECTION_TOKENS.HOME_SCRAPER,
      useClass: HomeScraper,
    },
    {
      provide: INJECTION_TOKENS.STRESS_SCRAPER,
      useClass: StressScraper,
    },
    {
      provide: INJECTION_TOKENS.ACTIVITIES_SCRAPER,
      useClass: ActivitiesScraper,
    },
    {
      provide: INJECTION_TOKENS.ACTIVITY_REPORT_SCRAPER,
      useClass: ActivityReportScraper,
    },
  ],
  exports: [INJECTION_TOKENS.BROWSER_SCRAPER_PORT],
})
export class PlaywrightModule {}
