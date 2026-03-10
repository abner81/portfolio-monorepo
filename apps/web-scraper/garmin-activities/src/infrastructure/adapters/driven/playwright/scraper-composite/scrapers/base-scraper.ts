import { Page } from "playwright";

export abstract class BaseScraper {
    protected page?: Page;

  setPage(page: Page) {
    this.page = page;
  }

  protected ensureInitialized() {
    if (!this.page) {
      throw new Error(`[${this.constructor.name}] Erro: Chamaste um método de extração sem antes rodar o init(page)!`);
    }

  }
}