import { isCPF } from 'brazilian-values';

export const validateDocumentNumber = (value: string) => {
  if (!isCPF(value)) {
    throw new Error('Documento inválido');
  }

  return value;
};
