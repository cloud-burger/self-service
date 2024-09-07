import { getFormattedCurrency } from './currency';

describe('currency', () => {
  it('should format currency successfully', () => {
    expect(getFormattedCurrency(10)).toEqual('R$\xa010,00');
  });

  it('should format currency with cents successfully', () => {
    expect(getFormattedCurrency(10.99)).toEqual('R$\xa010,99');
  });
});
