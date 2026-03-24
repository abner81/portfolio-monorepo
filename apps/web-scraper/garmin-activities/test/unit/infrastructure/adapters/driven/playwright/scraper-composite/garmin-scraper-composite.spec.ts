import { Test, TestingModule } from '@nestjs/testing';
import { Page } from 'playwright';
import { GarminScraperComposite } from 'garmin-activities/infra/adapters/driven/playwright/scraper-composite/garmin-scraper-composite';
import { BaseScraper } from 'garmin-activities/infra/adapters/driven/playwright/scraper-composite/scrapers/base-scraper';
import { INJECTION_TOKENS } from 'garmin-activities/shared/constants/injection-tokens';
import { BaseScraperIsNotInitializedException } from 'garmin-activities/domain/exceptions/base-scraper-is-not-initialized.exception';

// Mock scraper implementation for testing
class MockBodyBatteryScraper extends BaseScraper<{ batteryLevel: number }> {
  protected async doScrape(): Promise<{ batteryLevel: number }> {
    return { batteryLevel: 80 };
  }
}

class MockSleepScraper extends BaseScraper<{ sleepDuration: number }> {
  protected async doScrape(): Promise<{ sleepDuration: number }> {
    return { sleepDuration: 8 };
  }
}

class MockHomeScraper extends BaseScraper<{ steps: number }> {
  protected async doScrape(): Promise<{ steps: number }> {
    return { steps: 10000 };
  }
}

class MockStressScraper extends BaseScraper<{ stressLevel: number }> {
  protected async doScrape(): Promise<{ stressLevel: number }> {
    return { stressLevel: 30 };
  }
}

class MockActivitiesScraper extends BaseScraper<
  Array<{ id: string; type: string; duration: number }>
> {
  protected async doScrape(): Promise<
    Array<{ id: string; type: string; duration: number }>
  > {
    return [{ id: '1', type: 'running', duration: 60 }];
  }
}

describe('GarminScraperComposite', () => {
  let composite: GarminScraperComposite;
  let mockPage: Page;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: INJECTION_TOKENS.BODY_BATTERY_SCRAPER,
          useValue: mockBodyBatteryScraper,
        },
        {
          provide: INJECTION_TOKENS.SLEEP_SCRAPER,
          useValue: mockSleepScraper,
        },
        {
          provide: INJECTION_TOKENS.HOME_SCRAPER,
          useValue: mockHomeScraper,
        },
        {
          provide: INJECTION_TOKENS.STRESS_SCRAPER,
          useValue: mockStressScraper,
        },
        {
          provide: INJECTION_TOKENS.ACTIVITIES_SCRAPER,
          useValue: mockActivitiesScraper,
        },
        GarminScraperComposite,
      ],
    }).compile();

    composite = module.get<GarminScraperComposite>(GarminScraperComposite);

    // Create a mock page
    mockPage = {
      url: () => 'https://example.com',
      goto: jest.fn().mockResolvedValue(undefined),
      getByLabel: jest.fn().mockReturnValue({
        fill: jest.fn().mockResolvedValue(undefined),
      } as any),
      getByRole: jest.fn().mockReturnValue({
        click: jest.fn().mockResolvedValue(undefined),
      } as any),
      check: jest.fn().mockResolvedValue(undefined),
      waitForURL: jest.fn().mockResolvedValue(undefined),
    } as unknown as Page;
  });

  describe('Composite Pattern', () => {
    it('should delegate to individual scrapers after setPage() is called', async () => {
      // Set the page first
      composite.setPage(mockPage);

      // Now we should be able to call each scraper
      const bodyBatteryResult = await composite.bodyBattery.scrape();
      const sleepResult = await composite.sleep.scrape();
      const homeResult = await composite.home.scrape();
      const stressResult = await composite.stress.scrape();
      const activitiesResult = await composite.activities.scrape();

      expect(bodyBatteryResult).toEqual({ batteryLevel: 80 });
      expect(sleepResult).toEqual({ sleepDuration: 8 });
      expect(homeResult).toEqual({ steps: 10000 });
      expect(stressResult).toEqual({ stressLevel: 30 });
      expect(activitiesResult).toEqual([
        { id: '1', type: 'running', duration: 60 },
      ]);
    });

    it('should call setPage on all scrapers when setPage() is called on composite', async () => {
      // Use any to bypass TypeScript issues with private methods
      const setPageSpy = jest.spyOn(mockBodyBatteryScraper as any, 'setPage');
      const setPageSpy2 = jest.spyOn(mockSleepScraper as any, 'setPage');
      const setPageSpy3 = jest.spyOn(mockHomeScraper as any, 'setPage');
      const setPageSpy4 = jest.spyOn(mockStressScraper as any, 'setPage');
      const setPageSpy5 = jest.spyOn(mockActivitiesScraper as any, 'setPage');

      composite.setPage(mockPage);

      expect(setPageSpy).toHaveBeenCalledWith(mockPage);
      expect(setPageSpy2).toHaveBeenCalledWith(mockPage);
      expect(setPageSpy3).toHaveBeenCalledWith(mockPage);
      expect(setPageSpy4).toHaveBeenCalledWith(mockPage);
      expect(setPageSpy5).toHaveBeenCalledWith(mockPage);
    });
  });

  describe('Page Not Set Error', () => {
    it('should throw an error when calling scrapers without setPage()', () => {
      // Create a new instance without calling setPage to test the proxy behavior
      expect(() => {
        // Accessing any scraper property should throw
        // Using type assertion to bypass TypeScript
        (composite as any).bodyBattery;
      }).toThrow(BaseScraperIsNotInitializedException);
    });

    it('should throw an error when calling scrape() on a scraper without setPage()', async () => {
      // The proxy should prevent access to scrapers
      expect(() => {
        (composite as any).bodyBattery;
      }).toThrow(BaseScraperIsNotInitializedException);
    });

    it('should allow setPage to be called without error', () => {
      expect(() => {
        composite.setPage(mockPage);
      }).not.toThrow();
    });
  });
});
