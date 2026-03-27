import { IBaseScraper } from 'garmin-activities/application/ports/scrapers';
import { BaseScraperIsNotInitializedException } from 'garmin-activities/domain/exceptions';
import { Page } from 'playwright';
import { RegistryPage } from './page.decorator';

export abstract class BaseScraper<
  IOutput extends object,
  IInput extends object = {},
> implements IBaseScraper<IOutput, IInput>
{
  protected page!: Page;

  setPage(page: Page) {
    this.page = page;
  }

  protected abstract doScrape(input: IInput): Promise<IOutput>;

  @RegistryPage
  public async scrape(input: IInput): Promise<IOutput> {
    this.ensureInitialized();
    return this.doScrape(input);
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
