import 'reflect-metadata';
import { AsyncLocalStorage } from 'async_hooks';
import { Page } from 'playwright';

// 1. O "Túnel" de Contexto. Ele garante que a Page A não vaze para o Scraper B.
const pageStorage = new AsyncLocalStorage<Page>();

/**
 * Decorator de MÉTODO para o Maestro.
 * Ele cria o escopo onde a página será registrada.
 */
export function RegistryPage(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const page = args[0] as Page; // Assume que Page é o primeiro argumento
    if (!page)
      throw new Error(
        'A Page deve ser o primeiro argumento do método @RegistryPage',
      );

    // Executa o método dentro do contexto da página fornecida
    return pageStorage.run(page, () => {
      return originalMethod.apply(this, args);
    });
  };
}

/**
 * Decorator de PROPRIEDADE para o Helper.
 * Ele converte a propriedade em um acesso dinâmico ao contexto.
 */
export function InjectPage(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    get: () => {
      const page = pageStorage.getStore();
      if (!page) {
        throw new Error(
          `[InjectPage] Erro: Tentaste usar a página em ${target.constructor.name} fora de um contexto @RegistryPage!`,
        );
      }
      return page;
    },
    enumerable: true,
    configurable: true,
  });
}
