import { mock, MockProxy } from 'jest-mock-extended';
import { makeCustomer } from 'tests/factories/make-customer';
import Connection from '~/api/postgres/connection';
import ConnectionCache from '~/api/redis/connection-cache';
import { CustomerRepository } from './customer-repository';

describe('customer repository', () => {
  let connection: MockProxy<Connection>;
  let connectionCache: MockProxy<ConnectionCache>;
  let customerRepository: CustomerRepository;

  beforeAll(() => {
    connection = mock();
    connectionCache = mock();
    customerRepository = new CustomerRepository(connection, connectionCache);
  });

  it('should return null while find customer by document number and customer not found', async () => {
    connection.query.mockResolvedValue({
      records: [],
    });
    connectionCache.get.mockResolvedValue({});

    const customer =
      await customerRepository.findByDocumentNumber('53523992060');

    expect(customer).toBeNull();
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: { document_number: '53523992060' },
      sql: 'SELECT * FROM public.customers WHERE document_number = :document_number',
    });
  });

  it('should return customer while find customer by document number', async () => {
    connection.query.mockResolvedValue({
      records: [
        {
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
          document_number: '1234567890',
          id: '123',
          name: 'John',
          email: 'john@gmail.com',
        },
      ],
    });

    const customer =
      await customerRepository.findByDocumentNumber('53523992060');

    expect(customer).toEqual({
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      documentNumber: '1234567890',
      email: 'john@gmail.com',
      id: '123',
      name: 'John',
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    });
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: { document_number: '53523992060' },
      sql: 'SELECT * FROM public.customers WHERE document_number = :document_number',
    });
  });

  it('should create customer successfully', async () => {
    connection.query.mockResolvedValue({
      records: [],
    });

    await customerRepository.create(makeCustomer());

    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: {
        created_at: '2024-07-12T22:18:26.351Z',
        document_number: '53523992060',
        email: 'johndue@gmail.com',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        name: 'John Due',
        updated_at: '2024-07-12T22:18:26.351Z',
      },
      sql: 'INSERT INTO public.customers (id,name,document_number,email,created_at,updated_at) VALUES (:id,:name,:document_number,:email,:created_at,:updated_at)',
    });
  });

  it('should return cached customer while find customer by document number', async () => {
    connectionCache.get.mockResolvedValue([{
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      document_number: '1234567890',
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
    }]);

    const customer =
      await customerRepository.findByDocumentNumber('1234567890');

    expect(customer).toEqual({
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      documentNumber: '1234567890',
      email: 'john@gmail.com',
      id: '123',
      name: 'John',
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    });
  });
});
