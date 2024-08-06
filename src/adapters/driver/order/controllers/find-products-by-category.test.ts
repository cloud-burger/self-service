import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeProduct } from 'tests/factories/make-product';
import { FindProductsByCategoryUseCase } from '~/domain/order/use-cases/find-products-by-category';
import { FindProductsByCategoryController } from './find-products-by-category';

describe('find product by category controller', () => {
  let findProductsByCategoryUseCase: MockProxy<FindProductsByCategoryUseCase>;
  let findProductsByCategoryController: FindProductsByCategoryController;

  beforeAll(() => {
    findProductsByCategoryUseCase = mock();
    findProductsByCategoryController = new FindProductsByCategoryController(
      findProductsByCategoryUseCase,
    );
  });
  it('should be able to find product by category', async () => {
    findProductsByCategoryUseCase.execute.mockResolvedValue([makeProduct()]);

    const response = await findProductsByCategoryController.handler({
      pathParameters: {
        category: 'BURGER',
      },
    } as unknown as Request);

    expect(response).toEqual({
      body: [
        {
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          amount: 20.99,
          category: 'BURGER',
          description:
            'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
          name: 'Bacon Burger',
          image: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
      statusCode: 200,
    });
    expect(findProductsByCategoryUseCase.execute).toHaveBeenNthCalledWith(1, {
      category: 'BURGER',
    });
  });
});
