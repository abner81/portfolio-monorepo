import {
  ISleep,
  ISleepStages,
} from 'garmin-activities/application/ports/scrapers';
import { BaseScraper } from '../base-scraper';
import { SleepInfoNotFoundException } from 'garmin-activities/domain/exceptions';
import { Injectable } from '@nestjs/common';
import { parseSleepDurationInHours } from 'garmin-activities/shared/utils';
import { SleepHelper } from './sleep-helper';
import { InjectPage } from '../page.decorator';
import { Page } from 'playwright';

@Injectable()
export class SleepScraper extends BaseScraper<ISleep> {
  private readonly SLEEP_URL = process.env.GARMIN_SLEEP_URL!;
  private readonly EMPTY_VALUE = '--';

  private async ensureSleepDataExistsIn(helper: SleepHelper): Promise<void> {
    const isNoDataMode = await helper.noDataHeading.isVisible();
    if (isNoDataMode) throw new SleepInfoNotFoundException();
  }

  async doScrape(): Promise<ISleep> {
    const helper = new SleepHelper();
    await this.page.goto(this.SLEEP_URL);
    await this.page.waitForSelector('[class*="sleepScoreTabContainer"]');
    await this.ensureSleepDataExistsIn(helper);

    const totalSleepHours = (await helper.totalSleepHours.innerText())!;
    const sleepStart = (await helper.sleepStartAt.textContent())!;
    const wakeUp = (await helper.wakeUpAt.textContent())!;

    const stagesSelector = await helper.getSleepStages();
    const stages: Record<string, number> = {};
    for (let i = 0; i < stagesSelector.count; i++) {
      const stage = await helper.getStageInfoPer(stagesSelector.container, i);

      const value =
        stage.value === this.EMPTY_VALUE
          ? 0
          : parseSleepDurationInHours(stage.value);
      stages[stage.label] = value;
    }

    return {
      sleepDurationInHours: parseSleepDurationInHours(totalSleepHours),
      sleepStartAt: `${sleepStart.padStart(5, '0')}h`,
      wakeUpAt: `${wakeUp.padStart(5, '0')}h`,
      stages: stages as ISleepStages,
    };
  }
}
