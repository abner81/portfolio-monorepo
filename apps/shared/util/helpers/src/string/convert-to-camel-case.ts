import { capitalize } from './capitalize';

export function convertToCamelCase(str: string, _capitalize = true) {
  const result = str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

  if (_capitalize) {
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  return _capitalize ? capitalize(result) : result;
}
