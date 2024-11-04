import { capitalize } from './capitalize';

export function convertToCamelCase(str: string, _capitalize = true) {
  const result = str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  return _capitalize ? capitalize(result) : result;
}
