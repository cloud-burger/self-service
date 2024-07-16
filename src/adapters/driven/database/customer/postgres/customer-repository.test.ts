import { mock, MockProxy } from 'jest-mock-extended';
import { makeCustomer } from 'tests/factories/make-customer';
import Connection from '~/app/postgres/connection';
import { CustomerRepository } from './customer-repository';

describe('customer repository', () => {
  let connection: MockProxy<Connection>;
  let customerRepository: CustomerRepository;

  beforeAll(() => {
    connection = mock();
    customerRepository = new CustomerRepository(connection);
  });

  it('should return null while find customer by document number and customer not found', async () => {
    connection.query.mockResolvedValue({
      records: [],
    });

    const customer =
      await customerRepository.findByDocumentNumber('53523992060');

    expect(customer).toBeNull();
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: { document_number: '53523992060' },
      sql: 'SELECT * FROM public.customer WHERE document_number = :document_number',
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
          status: 'ACTIVE',
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
      status: 'ACTIVE',
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    });
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: { document_number: '53523992060' },
      sql: 'SELECT * FROM public.customer WHERE document_number = :document_number',
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
        status: 'ACTIVE',
        updated_at: '2024-07-12T22:18:26.351Z',
      },
      sql: 'INSERT INTO public.customer (id,name,document_number,status,email,created_at,updated_at) VALUES (:id,:name,:document_number,:status,:email,:created_at,:updated_at)',
    });
  });
});
