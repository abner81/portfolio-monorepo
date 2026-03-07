import { Module } from '@nestjs/common';
import { INJECTION_TOKENS } from '@shared/constants/injection-tokens';
import { GarminPageObject } from '@infrastructure/adapters/driven/playwright/garmin.page-object';
import { GarminPlaywrightScraper } from '@infrastructure/adapters/driven/playwright/garmin-playwright.scraper';

@Module({
  providers: [
    GarminPageObject,
    GarminPlaywrightScraper,
    {
      provide: INJECTION_TOKENS.BROWSER_SCRAPER_PORT,
      useExisting: GarminPlaywrightScraper,
    },
  ],
  exports: [INJECTION_TOKENS.BROWSER_SCRAPER_PORT],
})
export class PlaywrightModule {}
