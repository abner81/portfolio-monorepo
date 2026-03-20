import { Locator } from 'playwright';

export class ActivityParser {
  private static readonly monthMap: Record<string, number> = {
    Jan: 0,
    Fev: 1,
    Mar: 2,
    Abr: 3,
    Mai: 4,
    Jun: 5,
    Jul: 6,
    Ago: 7,
    Set: 8,
    Out: 9,
    Nov: 10,
    Dez: 11,
  };

  static async parseDate(row: Locator) {
    const dayMonthText = await row
      .locator('[class*="activityDate__"]')
      .innerText();
    const yearText = await row
      .locator('[class*="activityDateYear__"]')
      .innerText();

    const [dayStr, monthAbbr] = dayMonthText.split(' ');
    const monthIndex = this.monthMap[monthAbbr] ?? 0;
    return new Date(parseInt(yearText), monthIndex, parseInt(dayStr));
  }
}
