import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeProduct } from 'tests/factories/make-product';
import { CreateProductUseCase } from '~/use-cases/product/create';
import { CreateProductController } from './create';

describe('create product controller', () => {
  let createProductUseCase: MockProxy<CreateProductUseCase>;
  let createProductController: CreateProductController;

  beforeAll(() => {
    createProductUseCase = mock();
    createProductController = new CreateProductController(createProductUseCase);
  });

  it('should throw validation error while create product when request is invalid', async () => {
    try {
      await createProductController.handler({
        body: {
          amount: -1,
          name: 'Test',
          category: 'Bebida',
          description: 'Description',
        },
      } as unknown as Request);
    } catch (error) {
      expect(error.toObject()).toEqual({
        invalidParams: [
          {
            name: 'category',
            reason:
              'Product category must be one of [BURGER, SIDE, DRINK, DESSERT]',
            value: 'Bebida',
          },
          {
            name: 'amount',
            reason: 'Product amount must be greater than or equal to 0',
            value: -1,
          },
        ],
        reason: 'Invalid request data',
      });
    }

    expect(createProductUseCase.execute).not.toHaveBeenCalled();
  });

  it('should create product successfully', async () => {
    createProductUseCase.execute.mockResolvedValue(makeProduct());

    const response = await createProductController.handler({
      body: {
        amount: 20.99,
        name: 'Bacon Burger',
        category: 'BURGER',
        description:
          'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
      },
    } as unknown as Request);

    expect(response).toEqual({
      body: {
        amount: 'R$\xa020,99',
        category: 'BURGER',
        description:
          'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        name: 'Bacon Burger',
      },
      statusCode: 201,
    });
    expect(createProductUseCase.execute).toHaveBeenNthCalledWith(1, {
      amount: 20.99,
      category: 'BURGER',
      description:
        'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
      name: 'Bacon Burger',
    });
  });
});
