import { Locator, Page } from 'playwright';
import { InjectPage } from '../page.decorator';

export class ActivityReportHelper {
  public columnIndexes: Record<string, number> = {};

  @InjectPage
  private page!: Page;

  public get tableDataSelector() {
    return 'table tbody tr';
  }

  public async getAllTableHeaders() {
    return await this.page.locator('table thead tr th').all();
  }

  public async getAllTableRows() {
    return await this.page.locator('table tbody tr').all();
  }

  public async groupByWeek() {
    const selectInput = this.page
      .locator('[class*="ProgressSummary_reportFilter"] select')
      .first();
    await selectInput.selectOption('GROUP_BY_WEEK');
  }

  public async populateColumnIndexes(headers: Locator[]) {
    headers.forEach(async (th, index) => {
      const key = await th.getAttribute('data-key');
      if (key) {
        this.columnIndexes[key] = index;
      }
    });
  }

  public async getTextByKey(key: string, row: Locator) {
    const colIndex = this.columnIndexes[key];
    const cellText = await row.locator('td').nth(colIndex).innerText();
    if (colIndex !== undefined && cellText) {
      return cellText.trim() || '--';
    }

    throw new Error(`Coluna com chave ${key} não encontrada.`);
  }
}
