import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GarminPlaywrightScraper } from '@infrastructure/adapters/driven/playwright/garmin-playwright.scraper';
import { GarminPageObject } from '@infrastructure/adapters/driven/playwright/garmin.page-object';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  const garminScraper = new GarminPlaywrightScraper(new GarminPageObject());
  await garminScraper.scrapeActivities({});
}

void bootstrap();
