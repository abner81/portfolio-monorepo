import { Module } from '@nestjs/common';
import { INJECTION_TOKENS } from '@shared/constants/injection-tokens';
import { GarminScraper } from '@infrastructure/adapters/driven/playwright/scraper-composite/garmin-scraper-composite';
import { GarminPlaywrightScraper } from '@infrastructure/adapters/driven/playwright/garmin-playwright.scraper';

@Module({
  providers: [
    GarminScraper,
    GarminPlaywrightScraper,
    {
      provide: INJECTION_TOKENS.BROWSER_SCRAPER_PORT,
      useExisting: GarminPlaywrightScraper,
    },
  ],
  exports: [INJECTION_TOKENS.BROWSER_SCRAPER_PORT],
})
export class PlaywrightModule {}
