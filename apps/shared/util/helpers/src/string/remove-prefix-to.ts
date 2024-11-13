export const removePrefixTo = (str: string, separator = '-') => {
  const array = str.split(separator);
  array.splice(0, 1);
  const result = array.join(separator);
  return result.startsWith('-') ? result.slice(1) : result;
};
