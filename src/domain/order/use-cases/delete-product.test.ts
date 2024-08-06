import { mock, MockProxy } from 'jest-mock-extended';
import { makeProduct } from 'tests/factories/make-product';
import { ProductRepository } from '../repositories/product';
import { DeleteProductUseCase } from './delete-product';

describe('delete product use case', () => {
  let productRepository: MockProxy<ProductRepository>;
  let deleteProductUseCase: DeleteProductUseCase;

  beforeAll(() => {
    productRepository = mock();
    deleteProductUseCase = new DeleteProductUseCase(productRepository);
  });

  it('should delete product successfully', async () => {
    productRepository.findById.mockResolvedValue(makeProduct());

    const deleted = await deleteProductUseCase.execute({
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e'
    });

    expect(deleted).toEqual(true);
  });
});
