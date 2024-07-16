import { makeCustomer } from 'tests/factories/make-customer';
import { DatabaseCustomerMapper } from './database-customer';

describe('database customer mapper', () => {
  it('should map to domain', () => {
    expect(
      DatabaseCustomerMapper.toDomain({
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
        document_number: '1234567890',
        id: '123',
        name: 'John',
        status: 'ACTIVE',
        email: 'john@gmail.com',
      }),
    ).toEqual({
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      documentNumber: '1234567890',
      email: 'john@gmail.com',
      id: '123',
      name: 'John',
      status: 'ACTIVE',
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    });
  });

  it('should map to database', () => {
    expect(DatabaseCustomerMapper.toDatabase(makeCustomer())).toEqual({
      created_at: '2024-07-12T22:18:26.351Z',
      document_number: '53523992060',
      email: 'johndue@gmail.com',
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      name: 'John Due',
      status: 'ACTIVE',
      updated_at: '2024-07-12T22:18:26.351Z',
    });
  });
});
