import { mock, MockProxy } from 'jest-mock-extended';
import { Customer } from '~/domain/customer/entities/customer';
import { Order } from '~/domain/order/entities/order';
import { Product } from '~/domain/order/entities/product';
import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';
import { OrderRepository } from '~/domain/order/repositories/order';
import { ListOrdersUseCase } from './list';

describe('list orders use case', () => {
  let orderRepository: MockProxy<OrderRepository>;
  let listOrdersUseCase: ListOrdersUseCase;

  beforeAll(() => {
    orderRepository = mock();
    listOrdersUseCase = new ListOrdersUseCase(orderRepository);
  });

  it('should list orders successfully', async () => {
    orderRepository.findMany.mockResolvedValue([
      new Order({
        amount: 10,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        customer: null,
        id: '123',
        products: [
          new Product({
            amount: 10,
            category: ProductCategory.BURGER,
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            description: 'Hamburger de salmão',
            id: '123',
            image: null,
            name: 'X-Salmão',
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
          }),
        ],
        status: OrderStatus.DONE,
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      }),
      new Order({
        amount: 10,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        customer: new Customer({
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          documentNumber: '01234567890',
          email: 'john@gmail.com',
          id: '123',
          name: 'John Due',
          updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        }),
        id: '123',
        products: [
          new Product({
            amount: 10,
            category: ProductCategory.BURGER,
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            description: 'Hamburger de salmão',
            id: '123',
            image: null,
            name: 'X-Salmão',
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
          }),
        ],
        status: OrderStatus.DONE,
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      }),
    ]);

    const orders = await listOrdersUseCase.execute({
      page: '1',
      size: '10',
      status: 'DONE',
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
    expect(orderRepository.findMany).toHaveBeenNthCalledWith(1, {
      page: '1',
      size: '10',
      status: 'DONE',
    });
  });
});
