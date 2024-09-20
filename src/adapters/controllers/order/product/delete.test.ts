import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { DeleteProductUseCase } from '~/domain/order/use-cases/product/delete';
import { DeleteProductController } from './delete';

describe('delete product controller', () => {
  let deleteProductUseCase: MockProxy<DeleteProductUseCase>;
  let deleteProductController: DeleteProductController;

  beforeAll(() => {
    deleteProductUseCase = mock();
    deleteProductController = new DeleteProductController(deleteProductUseCase);
  });

  it('should delete product successfully', async () => {
    deleteProductUseCase.execute.mockResolvedValue();

    const response = await deleteProductController.handler({
      pathParameters: {
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      },
    } as unknown as Request);

    expect(response).toEqual({
      statusCode: 204,
    });
  });
});
