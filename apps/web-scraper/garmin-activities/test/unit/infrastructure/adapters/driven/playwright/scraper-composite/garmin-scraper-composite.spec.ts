import { Page } from 'playwright';
import { GarminScraperComposite } from 'garmin-activities/infra/adapters/driven/playwright/scraper-composite/garmin-scraper-composite';
import { BaseScraperIsNotInitializedException } from 'garmin-activities/domain/exceptions/base-scraper-is-not-initialized.exception';
import { makeMockScrapersFactory } from './mock-scrapers.helper';

describe('GarminScraperComposite', () => {
  let sut: GarminScraperComposite;
  let mockPage: Page;

  const mock = makeMockScrapersFactory();

  beforeEach(() => {
    // Create mock page
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

    // Create the composite manually to bypass the NestJS DI proxy issue
    sut = new GarminScraperComposite(
      mock.bodyBatteryScraper,
      mock.sleepScraper,
      mock.homeScraper,
      mock.stressScraper,
      mock.activitiesScraper,
    );

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

  describe('Garmin Scraper Composite', () => {
    it('should delegate to individual scrapers after setPage() is called', async () => {
      // Set the page first
      sut.setPage(mockPage);

      // Now we should be able to call each scraper
      const bodyBatteryResult = await sut.bodyBattery.scrape();
      const sleepResult = await sut.sleep.scrape();
      const homeResult = await sut.home.scrape();
      const stressResult = await sut.stress.scrape();
      const activitiesResult = await sut.activities.scrape();

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
      const setPageSpy = jest.spyOn(mock.bodyBatteryScraper as any, 'setPage');
      const setPageSpy2 = jest.spyOn(mock.sleepScraper as any, 'setPage');
      const setPageSpy3 = jest.spyOn(mock.homeScraper as any, 'setPage');
      const setPageSpy4 = jest.spyOn(mock.stressScraper as any, 'setPage');
      const setPageSpy5 = jest.spyOn(mock.activitiesScraper as any, 'setPage');

      sut.setPage(mockPage);

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
        (sut as any).bodyBattery;
      }).toThrow(BaseScraperIsNotInitializedException);
    });

    it('should throw an error when calling scrape() on a scraper without setPage()', async () => {
      // The proxy should prevent access to scrapers
      expect(() => {
        (sut as any).bodyBattery;
      }).toThrow(BaseScraperIsNotInitializedException);
    });

    it('should allow setPage to be called without error', () => {
      expect(() => {
        sut.setPage(mockPage);
      }).not.toThrow();
    });
  });
});
