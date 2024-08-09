import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { Customer } from '~/domain/customer/entities/customer';
import { Order } from '~/domain/order/entities/order';
import { Product } from '~/domain/order/entities/product';
import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';
import { ListOrdersUseCase } from '~/domain/order/use-cases/list-orders';
import { ListOrdersController } from './list-orders';

describe('list orders controller', () => {
  let listOrdersUseCase: MockProxy<ListOrdersUseCase>;
  let listOrdersController: ListOrdersController;

  beforeAll(() => {
    listOrdersUseCase = mock();
    listOrdersController = new ListOrdersController(listOrdersUseCase);
  });

  it('should throw when has validation errors', async () => {
    try {
      await listOrdersController.handler({
        params: {
          pageNumber: null,
          pageSize: null,
          status: 'OK',
        },
      } as unknown as Request);
    } catch (error) {
      expect(error.toObject()).toEqual({
        invalidParams: [
          {
            name: 'pageSize',
            reason: 'Page size must be a number',
            value: null,
          },
          {
            name: 'pageNumber',
            reason: 'Page number must be a number',
            value: null,
          },
          {
            name: 'status',
            reason:
              'status must be one of [RECEIVED, PREPARING, DONE, FINISHED]',
            value: 'OK',
          },
        ],
        reason: 'Invalid request data',
      });
      expect(listOrdersUseCase.execute).not.toHaveBeenCalled();
    }
  });

  it('should list orders successfully', async () => {
    listOrdersUseCase.execute.mockResolvedValue([
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

    const response = await listOrdersController.handler({
      params: {
        pageNumber: 1,
        pageSize: 10,
        status: 'DONE',
      },
    } as unknown as Request);

    expect(response).toEqual({
      body: [
        {
          amount: 10,
          id: '123',
          products: [
            {
              amount: 10,
              category: 'BURGER',
              description: 'Hamburger de salmão',
              id: '123',
              name: 'X-Salmão',
            },
          ],
          status: 'DONE',
        },
        {
          amount: 10,
          customer: {
            documentNumber: '01234567890',
            email: 'john@gmail.com',
            id: '123',
            name: 'John Due',
          },
          id: '123',
          products: [
            {
              amount: 10,
              category: 'BURGER',
              description: 'Hamburger de salmão',
              id: '123',
              name: 'X-Salmão',
            },
          ],
          status: 'DONE',
        },
      ],
      statusCode: 200,
    });
    expect(listOrdersUseCase.execute).toHaveBeenNthCalledWith(1, {
      page: '0',
      size: '10',
      status: 'DONE',
    });
  });
});
