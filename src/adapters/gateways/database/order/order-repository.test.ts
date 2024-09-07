import { mock, MockProxy } from 'jest-mock-extended';
import { makeOrder } from 'tests/factories/make-order';
import { makeProduct } from 'tests/factories/make-product';
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

  it('should create order successfully', async () => {
    connection.begin.mockResolvedValue();
    connection.query.mockResolvedValueOnce({
      records: [
        {
          number: 1,
        },
      ],
    });
    connection.commit.mockResolvedValue();
    connection.query.mockResolvedValueOnce({
      records: [],
    });

    const orderNumber = await orderRepository.create(makeOrder());

    expect(orderNumber).toEqual(1);
    expect(connection.begin).toHaveBeenCalledTimes(1);
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: {
        amount: 20.99,
        created_at: '2024-07-12T22:18:26.351Z',
        customer_id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        status: 'RECEIVED',
        updated_at: '2024-07-12T22:18:26.351Z',
      },
      sql: 'INSERT INTO public.orders (id,amount,customer_id,status,created_at,updated_at) VALUES (:id,:amount,:customer_id,:status,:created_at,:updated_at) RETURNING number;',
    });
    expect(connection.commit).toHaveBeenCalled();
    expect(connection.query).toHaveBeenNthCalledWith(2, {
      parameters: {
        notes: 'Sem bacon',
        order_id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        product_id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        quantity: 1,
      },
      sql: 'INSERT INTO public.orders_products (order_id,product_id,quantity,notes) VALUES (:order_id,:product_id,:quantity,:notes);',
    });
    expect(connection.rollback).not.toHaveBeenCalled();
  });

  it('should rollback transaction and throws when error while create order', async () => {
    connection.begin.mockResolvedValue();
    connection.query.mockResolvedValueOnce({
      records: [
        {
          number: 1,
        },
      ],
    });
    connection.query.mockResolvedValueOnce({
      records: [],
    });
    connection.query.mockRejectedValue(new Error('unknown error'));

    await expect(
      orderRepository.create(
        makeOrder({
          customer: null,
          products: [
            makeProduct({
              quantity: 10,
              notes: null,
            }),
            makeProduct({
              quantity: 1,
              notes: 'sem bacon',
            }),
          ],
        }),
      ),
    ).rejects.toThrow('Error while processing transaction');

    expect(connection.begin).toHaveBeenCalledTimes(1);
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: {
        amount: 20.99,
        created_at: '2024-07-12T22:18:26.351Z',
        customer_id: null,
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        status: 'RECEIVED',
        updated_at: '2024-07-12T22:18:26.351Z',
      },
      sql: 'INSERT INTO public.orders (id,amount,customer_id,status,created_at,updated_at) VALUES (:id,:amount,:customer_id,:status,:created_at,:updated_at) RETURNING number;',
    });
    expect(connection.commit).not.toHaveBeenCalled();
    expect(connection.query).toHaveBeenNthCalledWith(2, {
      parameters: {
        notes: null,
        order_id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        product_id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        quantity: 10,
      },
      sql: 'INSERT INTO public.orders_products (order_id,product_id,quantity,notes) VALUES (:order_id,:product_id,:quantity,:notes);',
    });
    expect(connection.query).toHaveBeenNthCalledWith(3, {
      parameters: {
        notes: 'sem bacon',
        order_id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        product_id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        quantity: 1,
      },
      sql: 'INSERT INTO public.orders_products (order_id,product_id,quantity,notes) VALUES (:order_id,:product_id,:quantity,:notes);',
    });
    expect(connection.rollback).toHaveBeenCalledTimes(1);
  });
});
