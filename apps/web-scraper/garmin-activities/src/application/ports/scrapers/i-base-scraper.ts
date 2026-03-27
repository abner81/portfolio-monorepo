export type IBaseScraper<IOutput extends object, IInput extends object = {}> = {
  scrape(input: IInput): Promise<IOutput>;
};
