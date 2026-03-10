import { ISleepScraper } from "@application/ports/scrapers";
import { BaseScraper } from "./base-scraper";
import { Page } from "playwright";
import { ISleepInfoOutput } from "../garmin-scraper-composite";

export class SleepScraper extends BaseScraper implements ISleepScraper {
      private readonly SLEEP_URL = process.env.GARMIN_SLEEP_URL!;
    async scrape(page: Page): Promise<ISleepInfoOutput> {
        await page.goto(this.SLEEP_URL);
        //    await this.ensureSleepDataExistsIn(page);
       
           const totalSleepTime = (await page
             .locator('[class^="SleepGauge_mainText"]')
             .first()
             .textContent())!;
       
           const sleepStartTime = (await page
             .locator('[class*="sleepTimeEditor"] span:first-child')
             .textContent())!;
       
           const wakeUpTime = (await page
             .locator('[class*="wakeTimeEditor"] span:first-child')
             .textContent())!;
       
           const formatTime = () => ({
             sleepStartTime: `${sleepStartTime.padStart(5, '0')}h`,
             wakeUpTime: `${wakeUpTime.padStart(5, '0')}h`,
           });
       
           return { totalSleepTime, ...formatTime() };
    }
}