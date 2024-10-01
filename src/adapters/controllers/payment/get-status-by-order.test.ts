import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { GetStatusByOrderUseCase } from '~/domain/payment/use-cases/get-status-by-order';
import { makePayment } from 'tests/factories/make-payment';
import { GetStatusByOrderController } from './get-status-by-order';
import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';

describe('get payment status by order id controller', () => {
  let getStatusByOrderUseCase: MockProxy<GetStatusByOrderUseCase>;
  let getStatusByOrderController: GetStatusByOrderController;

  beforeAll(() => {
    getStatusByOrderUseCase = mock();
    getStatusByOrderController =
      new GetStatusByOrderController(
        getStatusByOrderUseCase,
      );
  });

  it('should be able to get payment status by order id', async () => {
    getStatusByOrderUseCase.execute.mockResolvedValue(
      makePayment(),
    );

    const response = await getStatusByOrderController.handler({
      pathParameters: {
        orderId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      },
    } as unknown as Request);

    expect(response).toEqual({
      body: {
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        status: PaymentStatus.WAITING_PAYMENT,
      },
      statusCode: 200,
    });
    expect(getStatusByOrderUseCase.execute).toHaveBeenNthCalledWith(
      1,
      {
        orderId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e'
      },
    );
  });
});
