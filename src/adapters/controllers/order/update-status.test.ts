import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeOrder } from 'tests/factories/make-order';
import { UpdateOrderStatusUseCase } from '~/use-cases/order/update-status';
import { UpdateOrderStatusController } from './update-status';

describe('update order status controller', () => {
  let updateOrderStatusUseCase: MockProxy<UpdateOrderStatusUseCase>;
  let updateOrderStatusController: UpdateOrderStatusController;

  beforeAll(() => {
    updateOrderStatusUseCase = mock();
    updateOrderStatusController = new UpdateOrderStatusController(
      updateOrderStatusUseCase,
    );
  });

  it('should throw validation error when has validation errors', async () => {
    try {
      await updateOrderStatusController.handler({
        body: {
          status: 'RECEIVE',
        },
      } as unknown as Request);
    } catch (error) {
      expect(error.toObject()).toEqual({
        invalidParams: [
          {
            name: 'status',
            reason:
              'status must be one of [RECEIVED, PREPARING, DONE, FINISHED]',
            value: 'RECEIVE',
          },
          { name: 'id', reason: 'id is required', value: undefined },
        ],
        reason: 'Invalid request data',
      });
    }

    expect(updateOrderStatusUseCase.execute).not.toHaveBeenCalled();
  });

  it('should update order status successfully', async () => {
    updateOrderStatusUseCase.execute.mockResolvedValue(makeOrder());

    const response = await updateOrderStatusController.handler({
      body: {
        status: 'RECEIVED',
      },
      params: {
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      },
      pathParameters: {
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      },
    } as unknown as Request);

    expect(response).toEqual({
      body: {
        amount: 'R$\xa020,99',
        customer: {
          documentNumber: '53523992060',
          email: 'johndue@gmail.com',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          name: 'John Due',
        },
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        number: 123,
        products: [
          {
            amount: 'R$\xa020,99',
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
      statusCode: 200,
    });
    expect(updateOrderStatusUseCase.execute).toHaveBeenNthCalledWith(1, {
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      status: 'RECEIVED',
    });
  });
});
