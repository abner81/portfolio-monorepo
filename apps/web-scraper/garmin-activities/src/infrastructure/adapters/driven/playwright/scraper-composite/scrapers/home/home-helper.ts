import { Page } from 'playwright';

export type IGetInfoPerPeriod = {};

export class HomeHelper {
  private readonly LABELS_DESEJADAS = [
    /sono/i,
    /passos/i,
    /frequência cardíaca/i,
    /estresse/i,
    /calorias queimadas/i,
    /body battery/i,
    /minutos de intensidade/i,
  ];
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async scrapeInfoPer(
    periodSelector: string,
  ): Promise<IGetInfoPerPeriod> {
    const info = await this.page
      .locator(periodSelector)
      .evaluateAll(this.getLabelAndValue);

    const filteredInfo = Object.entries(info).filter(([label]) =>
      this.LABELS_DESEJADAS.some((pattern) => pattern.test(label)),
    );

    return Object.fromEntries(filteredInfo);
  }

  private getLabelAndValue(rows: HTMLElement[]) {
    const result: Record<string, string> = {};

    rows.forEach((row) => {
      const label = row
        .querySelector('[class*="DayView_dayViewLabel"]')!
        .textContent.trim();
      const value = row
        .querySelector('[class*="DayView_dayViewMetric"]')!
        .textContent.trim();

      result[label] = value;
    });

    return result;
  }
}
