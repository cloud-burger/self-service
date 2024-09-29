import { mock, MockProxy } from 'jest-mock-extended';
import { PaymentRepository } from '../repositories/payment';
import { GetStatusByOrderUseCase } from './get-status-by-order';
import { makePayment } from 'tests/factories/make-payment';
import { PaymentStatus } from '../entities/value-objects/payment-status';

describe('get payment status by order use case', () => {
  let paymentRepository: MockProxy<PaymentRepository>;
  let getStatusByOrderUseCase: GetStatusByOrderUseCase;

  beforeAll(() => {
    paymentRepository = mock();
    getStatusByOrderUseCase =
      new GetStatusByOrderUseCase(paymentRepository);
  });

  it('should throw not found error when payment does not exists', async () => {
    paymentRepository.findByOrderId.mockResolvedValue(null);

    await expect(
      getStatusByOrderUseCase.execute({ orderId: '1234' }),
    ).rejects.toThrow('Payment not found');

    expect(paymentRepository.findByOrderId).toHaveBeenNthCalledWith(
      1,
      '1234',
    );
  });

  it('should find payment by order id successfully', async () => {
    paymentRepository.findByOrderId.mockResolvedValue(makePayment());

    const payment = await getStatusByOrderUseCase.execute({
      orderId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    });

    expect(payment).toEqual({
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      amount: 20.99,
      status: PaymentStatus.WAITING_PAYMENT,
      order: expect.objectContaining({
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e'
      }),
    });
    expect(paymentRepository.findByOrderId).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
  });
});
