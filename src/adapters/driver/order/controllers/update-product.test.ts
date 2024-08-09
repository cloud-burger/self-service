import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeProduct } from 'tests/factories/make-product';
import { UpdateProductUseCase } from '~/domain/order/use-cases/update-product';
import { UpdateProductController } from './update-product';

describe('update product controller', () => {
  let updateProductUseCase: MockProxy<UpdateProductUseCase>;
  let updateProductController: UpdateProductController;

  beforeAll(() => {
    updateProductUseCase = mock();
    updateProductController = new UpdateProductController(updateProductUseCase);
  });

  it('should throw validation error while update product when request is invalid', async () => {
    try {
      await updateProductController.handler({
        body: {
          amount: -1,
          name: 'Test',
          category: 'Bebida',
          description: 'Description',
        },
        pathParameters: {
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
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

    expect(updateProductUseCase.execute).not.toHaveBeenCalled();
  });

  it('should update product successfully', async () => {
    updateProductUseCase.execute.mockResolvedValue(makeProduct());

    const response = await updateProductController.handler({
      body: {
        amount: 20.99,
        name: 'Bacon Burger',
        category: 'BURGER',
        description:
          'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
      },
      pathParameters: {
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      },
    } as unknown as Request);

    expect(response).toEqual({
      body: {
        amount: 20.99,
        category: 'BURGER',
        description:
          'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        name: 'Bacon Burger',
      },
      statusCode: 200,
    });
    expect(updateProductUseCase.execute).toHaveBeenNthCalledWith(1, {
      amount: 20.99,
      category: 'BURGER',
      description:
        'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
      name: 'Bacon Burger',
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    });
  });
});
