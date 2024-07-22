import { mock, MockProxy } from 'jest-mock-extended';
import { makeProduct } from 'tests/factories/make-product';
import { ProductCategory } from '../entities/value-objects/enums/product-category';
import { ProductRepository } from '../repositories/product';
import { UpdateProductUseCase } from './update-product';

describe('update product use case', () => {
  let productRepository: MockProxy<ProductRepository>;
  let updateProductUseCase: UpdateProductUseCase;

  beforeAll(() => {
    productRepository = mock();
    updateProductUseCase = new UpdateProductUseCase(productRepository);
  });

  it('should throw not found error when product does not exists', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(
      updateProductUseCase.execute({
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        amount: 21.99,
        category: ProductCategory.BURGER,
        description: 'Hambúrguer com bacon.',
        name: 'X-Bacon',
        image: null,
      }),
    ).rejects.toThrow('Product not found');

    expect(productRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(productRepository.update).not.toHaveBeenCalled();
  });

  it('should update product successfully', async () => {
    productRepository.findById.mockResolvedValue(makeProduct());

    const product = await updateProductUseCase.execute({
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      amount: 21.99,
      category: ProductCategory.BURGER,
      description: 'Hambúrguer com bacon.',
      name: 'X-Bacon',
      image: null,
    });

    expect(product).toEqual({
      amount: 21.99,
      category: 'BURGER',
      createdAt: expect.any(Date),
      description: 'Hambúrguer com bacon.',
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      image: null,
      name: 'X-Bacon',
      updatedAt: expect.any(Date),
    });
    expect(productRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(productRepository.update).toHaveBeenNthCalledWith(1, {
      amount: 21.99,
      category: 'BURGER',
      createdAt: expect.any(Date),
      description: 'Hambúrguer com bacon.',
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      image: null,
      name: 'X-Bacon',
      updatedAt: expect.any(Date),
    });
  });
});
