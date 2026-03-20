export type IBaseScraper<IOutput> = {
  scrape(): Promise<IOutput>;
};
