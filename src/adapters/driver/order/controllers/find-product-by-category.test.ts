import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeProduct } from 'tests/factories/make-product';
import { FindProductByCategoryUseCase } from '~/domain/order/use-cases/find-product-by-category';
import { FindProductByCategoryController } from './find-product-by-category';

describe('find product by category controller', () => {
    let findProductByCategoryUseCase: MockProxy<FindProductByCategoryUseCase>;
    let findProductByCategoryController: FindProductByCategoryController;

    beforeAll(() => {
        findProductByCategoryUseCase = mock();
        findProductByCategoryController = new FindProductByCategoryController(findProductByCategoryUseCase);

        it('should be able to find product by category', async () => {
            findProductByCategoryUseCase.execute.mockResolvedValue(
                [makeProduct()],
            );

            const response = await findProductByCategoryController.handler({
                pathParameters: {
                    category: 'BURGER',
                  },
            } as unknown as Request);
            
            expect(response).toEqual({
                body: {
                    id: "eba521ba-f6b7-46b5-ab5f-dd582495705e",
                    amount: 20.99,
                    category: "BURGER",
                    description: "Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.",
                    name: "Bacon Burger",
                    image: null,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                }
            });
            expect(findProductByCategoryUseCase.execute).toHaveBeenNthCalledWith(
                1,
                {
                    category: 'BURGER'
                }
            );
        });
    });
});