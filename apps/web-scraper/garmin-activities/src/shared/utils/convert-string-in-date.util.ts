const ensureValidDate = (date: string) => {
  const regexDate = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const validDate = regexDate.test(date);
  if (!validDate) {
    throw new Error('Invalid date format. Expected format: dd/mm/yyyy');
  }
};

export const convertStringInDate = (dd_mm_yyyy: string) => {
  ensureValidDate(dd_mm_yyyy);

  const [day, month, year] = dd_mm_yyyy.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
};
