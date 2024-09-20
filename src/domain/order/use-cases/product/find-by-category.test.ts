import { mock, MockProxy } from 'jest-mock-extended';
import { makeProduct } from 'tests/factories/make-product';
import { ProductCategory } from '../../entities/value-objects/enums/product-category';
import { ProductRepository } from '../../repositories/product';
import { FindProductsByCategoryUseCase } from './find-by-category';

describe('find product by category use case', () => {
  let productRepository: MockProxy<ProductRepository>;
  let findProductsByCategoryUseCase: FindProductsByCategoryUseCase;

  beforeAll(() => {
    productRepository = mock();
    findProductsByCategoryUseCase = new FindProductsByCategoryUseCase(
      productRepository,
    );
  });

  it('should find products by category succesfully', async () => {
    productRepository.findByCategory.mockResolvedValue([makeProduct()]);

    const products = await findProductsByCategoryUseCase.execute({
      category: ProductCategory.BURGER,
    });

    expect(products).toEqual([
      {
        amount: 20.99,
        category: 'BURGER',
        createdAt: expect.any(Date),
        description:
          'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        image: null,
        name: 'Bacon Burger',
        updatedAt: expect.any(Date),
      },
    ]);
    expect(productRepository.findByCategory).toHaveBeenNthCalledWith(
      1,
      ProductCategory.BURGER,
    );
  });
});
