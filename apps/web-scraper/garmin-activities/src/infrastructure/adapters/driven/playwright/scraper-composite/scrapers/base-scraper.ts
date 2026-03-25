import { IBaseScraper } from 'garmin-activities/application/ports/scrapers';
import { BaseScraperIsNotInitializedException } from 'garmin-activities/domain/exceptions/base-scraper-is-not-initialized.exception';
import { Page } from 'playwright';
import { RegistryPage, InjectPage } from './page.decorator';

export abstract class BaseScraper<IOutput extends object>
  implements IBaseScraper<IOutput>
{
  protected page!: Page;

  setPage(page: Page) {
    this.page = page;
  }

  protected abstract doScrape(): Promise<IOutput>;

  @RegistryPage
  public async scrape(): Promise<IOutput> {
    this.ensureInitialized();
    return this.doScrape();
  }

  private ensureInitialized(): asserts this is this & { page: Page } {
    if (this.page == null) {
      throw new BaseScraperIsNotInitializedException(
        this.constructor.name,
        'A página não foi definida. Chame setPage() antes de executar o scrape.',
      );
    }
  }
}
