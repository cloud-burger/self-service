import { validateDocumentNumber } from './document-number';

describe('validation helpers - document number', () => {
  it('should throw error when document number is invalid', () => {
    expect(() => {
      validateDocumentNumber('1234');
    }).toThrow('Invalid document number');
  });

  it('should return document number', () => {
    expect(validateDocumentNumber('21348814020')).toEqual('21348814020');
    expect(validateDocumentNumber('903.512.877-01')).toEqual('903.512.877-01');
  });
});
