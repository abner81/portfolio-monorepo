export class BaseScraperIsNotInitializedException extends Error {
  override readonly name = 'BaseScraperIsNotInitializedException';

  constructor(
    scraperName: string,
    message = `Para iniciar o scraper, é necessário chamar o método setPage()`,
  ) {
    super(`[${scraperName}] - ${message}`);
  }
}
