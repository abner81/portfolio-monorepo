import { Module } from '@nestjs/common';
import { INJECTION_TOKENS } from '@shared/constants/injection-tokens';
import { GarminPlaywrightScraper } from '@infrastructure/adapters/driven/playwright/garmin-playwright.scraper';
import { GarminScraperComposite } from './scraper-composite/garmin-scraper-composite';
import { SleepScraper } from './scraper-composite/scrapers/sleep-scraper';
import { BodyBatteryScraper } from './scraper-composite/scrapers';

@Module({
  providers: [
    GarminScraperComposite,
    GarminPlaywrightScraper,
    SleepScraper,
    BodyBatteryScraper,
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
  ],
  exports: [INJECTION_TOKENS.BROWSER_SCRAPER_PORT, GarminScraperComposite],
})
export class PlaywrightModule {}
