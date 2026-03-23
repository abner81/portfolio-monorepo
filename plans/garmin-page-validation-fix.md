# Plano de Correção: Validação de Página em BaseScraper

## Problema Identificado

O método `ensureInitialized()` em [`base-scraper.ts`](apps/web-scraper/garmin-activities/src/infrastructure/adapters/driven/playwright/scraper-composite/scrapers/base-scraper.ts:22) não está disparando o erro quando `page` é `undefined`. O código atual:

```typescript
private ensureInitialized(): asserts this is this & { page: Page } {
  console.log('ensure', this.page);

  if (!this.page)
    throw new BaseScraperIsNotInitializedException(this.constructor.name);
}
```

### Causa Raiz

A propriedade `page` é declarada com `!` (non-null assertion):

```typescript
protected page!: Page;
```

O TypeScript trata isso como `Page` (não `Page | undefined`), então a verificação `!this.page` pode não funcionar conforme esperado em tempo de execução.

## Cenários queDEVEM Disparar o Erro

| Cenário | Descrição                                                 |
| ------- | --------------------------------------------------------- |
| 1       | `setPage()` nunca é chamado antes de `scrape()`           |
| 2       | `setPage()` é chamado com `undefined` ou `null`           |
| 3       | `setPage()` é chamado com uma página inválida             |
| 4       | Scrapers são usados sem passar pela inicialização correta |

## Solução Proposta (Revisada conforme feedback)

**Restrição:** Toda a validação deve ficar concentrada em `base-scraper.ts` e `garmin-scraper-composite.ts`. Nenhum método adicional deve ser exposto para `garmin-playwright.scraper.ts`.

### Passo 1: Corrigir a Verificação em [`base-scraper.ts`](apps/web-scraper/garmin-activities/src/infrastructure/adapters/driven/playwright/scraper-composite/scrapers/base-scraper.ts)

Modificar o método `ensureInitialized()` para usar uma verificação mais robusta:

```typescript
private ensureInitialized(): void {
  // Verificação explícita para undefined/null
  if (this.page === undefined || this.page === null) {
    throw new BaseScraperIsNotInitializedException(
      this.constructor.name,
      'A página não foi definida. Chame setPage() antes de executar o scrape.'
    );
  }
}
```

**Nota:** Remover a declaração `!: Page` e usar `protected page: Page | undefined = undefined;` para permitir a verificação explícita.

### Passo 2: Adicionar Validação no GarminScraperComposite

O [`garmin-scraper-composite.ts`](apps/web-scraper/garmin-activities/src/infrastructure/adapters/driven/playwright/scraper-composite/garmin-scraper-composite.ts:40) deve validar que a página foi registrada antes de permitir operações de scraping:

```typescript
@RegistryPage
public setPage(page: Page) {
  if (!page) {
    throw new Error('A página não pode ser nula ou undefined');
  }
  console.log('registrando setPages');
  this.scrapers.forEach((scraper) => scraper.setPage(page));
}
```

### Passo 3: Fluxo de Validação

Quando `garmin.activities.scrape()` for chamado:

1. O método `scrape()` em `BaseScraper` chama `ensureInitialized()`
2. `ensureInitialized()` verifica se `page === undefined || page === null`
3. Se verdadeiro, lança `BaseScraperIsNotInitializedException`
4. A mensagem de erro deve ser clara: "[NomeDoScraper] - A página não foi definida. Chame setPage() antes de executar o scrape."

## Arquivos a Modificar

| Arquivo                       | Ação                                                                  |
| ----------------------------- | --------------------------------------------------------------------- |
| `base-scraper.ts`             | Corrigir verificação em `ensureInitialized()`; alterar tipo de `page` |
| `garmin-scraper-composite.ts` | Adicionar validação em `setPage()`                                    |

## Arquivos NÃO Modificados

| Arquivo                        | Motivo                                        |
| ------------------------------ | --------------------------------------------- |
| `garmin-playwright.scraper.ts` | Não deve conter lógica de validação adicional |

## Checklist de Implementação

- [ ] Modificar tipo de `page` em `base-scraper.ts` de `page!: Page` para `page: Page | undefined = undefined`
- [ ] Corrigir verificação em `ensureInitialized()` para usar comparação explícita
- [ ] Adicionar validação em `setPage()` em `garmin-scraper-composite.ts`
- [ ] Testar cenário: `setPage` nunca chamado → erro deve ser disparado
- [ ] Testar cenário: `setPage` chamado com `null` → erro deve ser disparado
- [ ] Testar cenário: `setPage` chamado corretamente → scrape funciona normalmente
