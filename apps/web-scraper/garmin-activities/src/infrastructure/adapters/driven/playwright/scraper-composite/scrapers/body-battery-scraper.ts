import { IBodyBatteryScraper } from "@application/ports/scrapers";
import { Page } from "playwright";
import { BaseScraper } from "./base-scraper";

export class BodyBatteryScraper extends BaseScraper implements IBodyBatteryScraper  {
    private readonly BODY_BATTERY_URL = process.env.GARMIN_BODY_BATTERY_URL!;
    
  async scrape(page: Page): Promise<void> {
 // # TODO: refatorar esse metodo como o gemini mostrou
    await page.goto(this.BODY_BATTERY_URL);
    // await this.ensureBodyBatteryInfoExistsIn(page);

    // # Quando tem Alta e baixa no score
    const highLevel = await page
      .locator('h2[class*="BodyBatteryGaugePastDays_value"]')
      .textContent();
    const lowLevel = await page
      .locator('h4[class*="BodyBatteryGaugePastDays_value"]')
      .textContent();

    // # Quando tem o total e most recent
    const mostRecentValue = await page
      .locator('[class*="BodyBatteryGauge_mostRecentValue"]')
      .textContent();
    const maxValue = await page
      .locator('[class*="BodyBatteryGauge_maxValue"]')
      .textContent();
    const summaries = await page
      .locator('[class*="BodyBatterySummary_bodyBatteryValue"]')
      .allTextContents();
    const summaryStats = {
      charged: summaries[0],
      drained: summaries[1],
    };

    const rawMessage = await page
      .locator('p[class*="BodyBatteryScoreMessage_message"]')
      .innerText();
    const scoreMessage = rawMessage.replace(/\s+Mais$/, '');

    await page.pause();

    return;
  }
}