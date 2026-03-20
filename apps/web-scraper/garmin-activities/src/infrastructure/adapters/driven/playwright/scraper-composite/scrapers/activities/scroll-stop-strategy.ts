import { Locator, Page } from 'playwright';
import { ActivityParser } from './activities-helper';

export type ScrollStrategyInput = {
  lastSavedActivityId: string;
  page: Page;
  scrollContainerId: string;
  lastRow: Locator;
};

export class ScrollStopStrategy {
  private readonly page: Page;
  private readonly scrollContainerId: string;
  private readonly lastSavedActivityId: string;
  private readonly MONTHS_LIMIT = 6;
  private readonly lastRow: Locator;

  private get limitDate() {
    const limitDate = new Date();
    limitDate.setMonth(limitDate.getMonth() - this.MONTHS_LIMIT);
    return limitDate;
  }

  constructor(props: ScrollStrategyInput) {
    this.page = props.page;
    this.scrollContainerId = props.scrollContainerId;
    this.lastSavedActivityId = props.lastSavedActivityId;
    this.lastRow = props.lastRow;
  }

  async shouldStop(): Promise<boolean> {
    if (await this.lastSavedIdWasFound()) {
      console.log(
        `✅ ID ${this.lastSavedActivityId} localizado na lista! Parando scroll...`,
      );
      return true;
    }

    if (await this.reachedLimitDate()) {
      console.log(`📅 Data limite atingida (${this.limitDate}). Parando...`);
      return true;
    }

    return false;
  }

  private async lastSavedIdWasFound() {
    const targetActivityId = this.page.locator(
      `${this.scrollContainerId} a[href$="/${this.lastSavedActivityId}"]`,
    );
    const wasFound = (await targetActivityId.count()) > 0;
    return wasFound;
  }

  private async reachedLimitDate() {
    const lastDate = await ActivityParser.parseDate(this.lastRow);
    return lastDate < this.limitDate;
  }
}
