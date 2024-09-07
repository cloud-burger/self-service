const LANG = 'pt-BR';
const CURRENCY = 'BRL';

export const getFormattedCurrency = (amount: number) => {
  return amount.toLocaleString(LANG, {
    style: 'currency',
    currency: CURRENCY,
  });
};
