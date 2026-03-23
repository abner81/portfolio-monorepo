import { IBaseScraper } from 'garmin-activities/application/ports/scrapers';
import { BaseScraperIsNotInitializedException } from 'garmin-activities/domain/exceptions/base-scraper-is-not-initialized.exception';
import { Page } from 'playwright';

export abstract class BaseScraper<IOutput extends object>
  implements IBaseScraper<IOutput>
{
  protected page!: Page;

  setPage(page: Page) {
    console.log(this.constructor.name, '- setPage');
    this.page = page;
  }

  protected abstract doScrape(): Promise<IOutput>;

  public async scrape(): Promise<IOutput> {
    this.ensureInitialized();
    return this.doScrape();
  }

  private ensureInitialized(): asserts this is this & { page: Page } {
    console.log('[DEBUG] ensureInitialized chamado, this.page:', this.page);
    if (this.page == null) {
      console.log('[DEBUG] this.page é null/undefined, throwing exception');
      console.error(
        '[ERROR] BaseScraperIsNotInitializedException será lançado agora',
      );
      throw new BaseScraperIsNotInitializedException(
        this.constructor.name,
        'A página não foi definida. Chame setPage() antes de executar o scrape.',
      );
    }
    console.log('[DEBUG] page OK, continuando scrape');
  }
}
