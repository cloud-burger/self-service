import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeOrder } from 'tests/factories/make-order';
import { CreateOrderUseCase } from '~/domain/order/use-cases/create-order';
import { CreateOrderController } from './create-order';

describe('create order controller', () => {
  let createOrderUseCase: MockProxy<CreateOrderUseCase>;
  let createOrderController: CreateOrderController;

  beforeAll(() => {
    createOrderUseCase = mock();
    createOrderController = new CreateOrderController(createOrderUseCase);
  });

  it('should throw validation error when request is invalid', async () => {
    try {
      await createOrderController.handler({
        headers: {
          'x-identification': '123',
        },
        body: {
          products: [
            {
              id: null,
              quantity: 'dez',
            },
          ],
        },
      } as unknown as Request);
    } catch (error) {
      expect(error.toObject()).toEqual({
        invalidParams: [
          { name: 'id', reason: 'Product id must be a string', value: null },
          {
            name: 'quantity',
            reason: 'Product quantity must be a number',
            value: 'dez',
          },
        ],
        reason: 'Invalid request data',
      });
    }

    expect(createOrderUseCase.execute).not.toHaveBeenCalled();
  });

  it('should create order successfully', async () => {
    createOrderUseCase.execute.mockResolvedValue(makeOrder());

    const response = await createOrderController.handler({
      headers: {
        'x-identification': '53523992060',
      },
      body: {
        products: [
          {
            id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
            quantity: 1,
            notes: 'Sem bacon',
          },
        ],
      },
    } as unknown as Request);

    expect(response).toEqual({
      body: {
        amount: 20.99,
        customer: {
          documentNumber: '53523992060',
          email: 'johndue@gmail.com',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          name: 'John Due',
        },
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        products: [
          {
            amount: 20.99,
            category: 'BURGER',
            description:
              'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
            id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
            name: 'Bacon Burger',
            notes: 'Sem bacon',
            quantity: 1,
          },
        ],
        status: 'RECEIVED',
      },
      statusCode: 201,
    });
    expect(createOrderUseCase.execute).toHaveBeenNthCalledWith(1, {
      customerTaxId: '53523992060',
      products: [
        {
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          notes: 'Sem bacon',
          quantity: 1,
        },
      ],
    });
  });
});
