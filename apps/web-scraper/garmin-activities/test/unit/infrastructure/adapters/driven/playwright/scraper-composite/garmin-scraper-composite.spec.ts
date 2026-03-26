import { Page } from 'playwright';
import { Test } from '@nestjs/testing';
import { GarminScraperComposite } from 'garmin-activities/infra/adapters/driven/playwright/scraper-composite/garmin-scraper-composite';
import { BaseScraperIsNotInitializedException } from 'garmin-activities/domain/exceptions/base-scraper-is-not-initialized.exception';
import {
  makeMockScrapersFactory,
  mockPageFactory,
} from './mock-scrapers.helper';
import { INJECTION_TOKENS } from 'garmin-activities/shared/constants/injection-tokens';
import { BaseScraper } from 'garmin-activities/infra/adapters/driven/playwright/scraper-composite/scrapers/base-scraper';

describe('GarminScraperComposite', () => {
  let sut: GarminScraperComposite;
  let mockPage: Page;

  const mock = makeMockScrapersFactory();
  const sutClassProperties: (keyof GarminScraperComposite)[] = [
    'bodyBattery',
    'sleep',
    'home',
    'stress',
    'activities',
    'activityReport',
  ];

  beforeEach(async () => {
    mockPage = mockPageFactory();

    const module = await Test.createTestingModule({
      providers: [
        GarminScraperComposite,
        {
          provide: INJECTION_TOKENS.BODY_BATTERY_SCRAPER,
          useValue: mock.bodyBatteryScraper,
        },
        {
          provide: INJECTION_TOKENS.SLEEP_SCRAPER,
          useValue: mock.sleepScraper,
        },
        {
          provide: INJECTION_TOKENS.HOME_SCRAPER,
          useValue: mock.homeScraper,
        },
        {
          provide: INJECTION_TOKENS.STRESS_SCRAPER,
          useValue: mock.stressScraper,
        },
        {
          provide: INJECTION_TOKENS.ACTIVITIES_SCRAPER,
          useValue: mock.activitiesScraper,
        },
        {
          provide: INJECTION_TOKENS.ACTIVITY_REPORT_SCRAPER,
          useValue: mock.activityReportScraper,
        },
      ],
    }).compile();

    sut = module.get(GarminScraperComposite);
  });

  describe('Garmin Scraper Composite', () => {
    it('should call setPage on all scrapers when setPage() is called on composite', async () => {
      const bodyBatterySpy = jest.spyOn(mock.bodyBatteryScraper, 'setPage');
      const sleepScraperSpy = jest.spyOn(mock.sleepScraper, 'setPage');
      const setPagehomeScraperSpy = jest.spyOn(mock.homeScraper, 'setPage');
      const stressScraperSpy = jest.spyOn(mock.stressScraper, 'setPage');
      const activitiesScraperSpy = jest.spyOn(
        mock.activitiesScraper,
        'setPage',
      );
      const activityReportScraper = jest.spyOn(
        mock.activityReportScraper,
        'setPage',
      );

      sut.setPage(mockPage);

      expect(bodyBatterySpy).toHaveBeenCalledWith(mockPage);
      expect(sleepScraperSpy).toHaveBeenCalledWith(mockPage);
      expect(setPagehomeScraperSpy).toHaveBeenCalledWith(mockPage);
      expect(stressScraperSpy).toHaveBeenCalledWith(mockPage);
      expect(activitiesScraperSpy).toHaveBeenCalledWith(mockPage);
      expect(activityReportScraper).toHaveBeenCalledWith(mockPage);
    });

    it('should delegate to individual scrapers after setPage() is called', async () => {
      sut.setPage(mockPage);

      const bodyBatteryResult = await sut.bodyBattery.scrape();
      const sleepResult = await sut.sleep.scrape();
      const homeResult = await sut.home.scrape();
      const stressResult = await sut.stress.scrape();
      const activitiesResult = await sut.activities.scrape();
      const activityReport = await sut.activityReport.scrape();

      expect(bodyBatteryResult).toEqual(mock.bodyBatteryScraper.response);
      expect(sleepResult).toEqual(mock.sleepScraper.response);
      expect(homeResult).toEqual(mock.homeScraper.response);
      expect(stressResult).toEqual(mock.stressScraper.response);
      expect(activitiesResult).toEqual(mock.activitiesScraper.response);
      expect(activityReport).toEqual(mock.activityReportScraper.response);
    });
  });

  describe('Page Not Set Error', () => {
    it('should throw an error when calling scrape() without setPage()', () => {
      sutClassProperties.forEach((property) => {
        expect(() => {
          (sut[property] as BaseScraper<object>).scrape();
        }).toThrow(BaseScraperIsNotInitializedException);
      });
    });

    it('should throw an error when accessing scrapers without setPage()', () => {
      sutClassProperties.forEach((property) => {
        expect(() => {
          sut[property];
        }).toThrow(BaseScraperIsNotInitializedException);
      });
    });

    it('should allow setPage to be called without error', () => {
      expect(() => {
        sut.setPage(mockPage);
      }).not.toThrow();
    });
  });

  describe('Private Properties', () => {
    it('should init with false value. but change value', () => {
      expect((sut as any).pageInitialized).toBeFalsy();

      sut.setPage({} as any);

      expect((sut as any).pageInitialized).toBeTruthy();
    });

    it('should init scrapers[] with correct values', () => {
      expect((sut as any).scrapers).toStrictEqual([
        mock.bodyBatteryScraper,
        mock.sleepScraper,
        mock.homeScraper,
        mock.stressScraper,
        mock.activitiesScraper,
        mock.activityReportScraper,
      ]);
    });
  });
});
