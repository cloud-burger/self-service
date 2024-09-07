import { removeNullValues } from './remove-null-values';

interface Person {
  name: string;
  age: string;
  address: {
    street: string;
    number: string;
    state: string;
  };
}

describe('remove null values', () => {
  it('should remove null, undefined and empty values', () => {
    const person: Person = {
      name: 'John',
      age: null,
      address: {
        street: undefined,
        number: '',
        state: 'SP',
      },
    };

    expect(removeNullValues(person)).toEqual({
      address: { state: 'SP' },
      name: 'John',
    });
  });
});
