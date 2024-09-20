import { mock, MockProxy } from 'jest-mock-extended';
import { makeProduct } from 'tests/factories/make-product';
import { ProductRepository } from '../../repositories/product';
import { DeleteProductUseCase } from './delete';

describe('delete product use case', () => {
  let productRepository: MockProxy<ProductRepository>;
  let deleteProductUseCase: DeleteProductUseCase;

  beforeAll(() => {
    productRepository = mock();
    deleteProductUseCase = new DeleteProductUseCase(productRepository);
  });

  it('should delete product successfully', async () => {
    productRepository.findById.mockResolvedValue(makeProduct());

    await deleteProductUseCase.execute({
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    });

    expect(productRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(productRepository.deleteById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
  });

  it('should throw not found when product does not exists', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(
      deleteProductUseCase.execute({
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      }),
    ).rejects.toThrow('Product not found');

    expect(productRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(productRepository.deleteById).not.toHaveBeenCalled();
  });
});
