import { mock, MockProxy } from 'jest-mock-extended';
import Connection from '~/app/postgres/connection';
import { OrderRepository } from './order-repository';
import { FIND_MANY } from './queries/find-many';

describe('order repository', () => {
  let connection: MockProxy<Connection>;
  let orderRepository: OrderRepository;

  beforeAll(() => {
    connection = mock();
    orderRepository = new OrderRepository(connection);
  });

  it('should return empty array when orders not found', async () => {
    connection.query.mockResolvedValue({
      records: [],
    });

    const orders = await orderRepository.findMany({
      page: '1',
      size: '10',
      status: 'DONE',
    });

    expect(orders).toEqual([]);
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: { page: '1', size: '10', status: 'DONE' },
      sql: FIND_MANY({ page: '1', size: '10', status: 'DONE' }),
    });
  });

  it('should return orders successfully', async () => {
    connection.query.mockResolvedValue({
      records: [
        {
          amount: 10,
          created_at: '2024-01-01',
          id: '123',
          products: [
            {
              amount: 10,
              category: 'BURGER',
              created_at: '2024-01-01',
              description: 'Hamburger de salmão',
              id: '123',
              name: 'X-Salmão',
              updated_at: '2024-01-01',
              image: null,
            },
          ],
          status: 'DONE',
          updated_at: '2024-01-01',
        },
        {
          amount: 10,
          created_at: '2024-01-01',
          id: '123',
          products: [
            {
              amount: 10,
              category: 'BURGER',
              created_at: '2024-01-01',
              description: 'Hamburger de salmão',
              id: '123',
              name: 'X-Salmão',
              updated_at: '2024-01-01',
              image: null,
            },
          ],
          status: 'DONE',
          updated_at: '2024-01-01',
          customer: {
            created_at: '2024-01-01',
            document_number: '01234567890',
            id: '123',
            name: 'John Due',
            updated_at: '2024-01-01',
            email: 'john@gmail.com',
          },
          customer_id: '123',
        },
      ],
    });

    const orders = await orderRepository.findMany({
      page: '1',
      size: '10',
    });

    expect(orders).toEqual([
      {
        amount: 10,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        customer: null,
        id: '123',
        products: [
          {
            amount: 10,
            category: 'BURGER',
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            description: 'Hamburger de salmão',
            id: '123',
            image: null,
            name: 'X-Salmão',
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
          },
        ],
        status: 'DONE',
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      },
      {
        amount: 10,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        customer: {
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          documentNumber: '01234567890',
          email: 'john@gmail.com',
          id: '123',
          name: 'John Due',
          updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        },
        id: '123',
        products: [
          {
            amount: 10,
            category: 'BURGER',
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            description: 'Hamburger de salmão',
            id: '123',
            image: null,
            name: 'X-Salmão',
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
          },
        ],
        status: 'DONE',
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      },
    ]);
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: { page: '1', size: '10' },
      sql: FIND_MANY({ page: '1', size: '10' }),
    });
  });
});
