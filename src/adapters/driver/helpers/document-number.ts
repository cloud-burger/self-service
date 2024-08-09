import { isCPF } from 'brazilian-values';

export const validateDocumentNumber = (value: string) => {
  if (!isCPF(value)) {
    throw new Error('Invalid document number');
  }

  return value;
};
