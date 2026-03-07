export class ScrapingFailedException extends Error {
  override readonly name = 'ScrapingFailedException';

  constructor(message = 'Scraping failed') {
    super(message);
  }
}
