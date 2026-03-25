/**
 * Função principal para formatar as chaves de um objeto
 * @param text A string original (ex: "FC MÉDIA")
 * @returns A string formatada em camelCase (ex: "fcMedia")
 */
export function parseKeyString(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z\s]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter((palavra) => palavra.length > 0)
    .map((palavra, index) => {
      if (index === 0) return palavra;
      return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    })
    .join('');
}
