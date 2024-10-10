import { mock, MockProxy } from 'jest-mock-extended';
import { makePayment } from 'tests/factories/make-payment';
import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';
import { PaymentRepository } from '~/domain/payment/repositories/payment';
import { PaymentService } from '~/domain/payment/services/payment';
import { UpdateOrderStatusUseCase } from '../order/update-status';
import { ProcessEventUseCase } from './process-event';

describe('process event use case', () => {
  let paymentService: MockProxy<PaymentService>;
  let paymentRepository: MockProxy<PaymentRepository>;
  let updateOrderStatusUseCase: MockProxy<UpdateOrderStatusUseCase>;
  let processEventUseCase: ProcessEventUseCase;

  beforeAll(() => {
    paymentService = mock();
    paymentRepository = mock();
    updateOrderStatusUseCase = mock();
    processEventUseCase = new ProcessEventUseCase(
      paymentService,
      paymentRepository,
      updateOrderStatusUseCase,
    );
  });

  it('should not process event when error', async () => {
    paymentService.findByExternalId.mockRejectedValue(new Error());

    await processEventUseCase.execute({
      externalId: '12345',
    });

    expect(paymentService.findByExternalId).toHaveBeenNthCalledWith(1, '12345');
    expect(paymentRepository.findById).not.toHaveBeenCalled();
    expect(paymentRepository.update).not.toHaveBeenCalled();
    expect(updateOrderStatusUseCase.execute).not.toHaveBeenCalled();
  });

  it('should process event successfully', async () => {
    paymentService.findByExternalId.mockResolvedValue(
      makePayment({ externalId: 12345 }),
    );

    await processEventUseCase.execute({
      externalId: '12345',
    });

    expect(paymentService.findByExternalId).toHaveBeenNthCalledWith(1, '12345');
    expect(paymentRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(paymentRepository.update).toHaveBeenNthCalledWith(1, {
      amount: 20.99,
      createdAt: expect.any(Date),
      externalId: 12345,
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      order: {
        amount: 20.99,
        createdAt: expect.any(Date),
        customer: {
          createdAt: expect.any(Date),
          documentNumber: '53523992060',
          email: 'johndue@gmail.com',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          name: 'John Due',
          updatedAt: expect.any(Date),
        },
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        number: 123,
        products: [
          {
            amount: 20.99,
            category: 'BURGER',
            createdAt: expect.any(Date),
            description:
              'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
            id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
            image: null,
            name: 'Bacon Burger',
            notes: 'Sem bacon',
            quantity: 1,
            updatedAt: expect.any(Date),
          },
        ],
        status: 'RECEIVED',
        updatedAt: expect.any(Date),
      },
      status: 'WAITING_PAYMENT',
      updatedAt: expect.any(Date),
    });
    expect(updateOrderStatusUseCase.execute).not.toHaveBeenCalled();
  });

  it('should process payment event successfully', async () => {
    paymentService.findByExternalId.mockResolvedValue(
      makePayment({ externalId: 12345, status: PaymentStatus.PAID }),
    );
    paymentRepository.findById.mockResolvedValue(makePayment());
    await processEventUseCase.execute({
      externalId: '12345',
    });

    expect(paymentService.findByExternalId).toHaveBeenNthCalledWith(1, '12345');
    expect(paymentRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(paymentRepository.update).toHaveBeenNthCalledWith(1, {
      amount: 20.99,
      createdAt: expect.any(Date),
      externalId: 12345,
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      order: {
        amount: 20.99,
        createdAt: expect.any(Date),
        customer: {
          createdAt: expect.any(Date),
          documentNumber: '53523992060',
          email: 'johndue@gmail.com',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          name: 'John Due',
          updatedAt: expect.any(Date),
        },
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        number: 123,
        products: [
          {
            amount: 20.99,
            category: 'BURGER',
            createdAt: expect.any(Date),
            description:
              'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
            id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
            image: null,
            name: 'Bacon Burger',
            notes: 'Sem bacon',
            quantity: 1,
            updatedAt: expect.any(Date),
          },
        ],
        status: 'RECEIVED',
        updatedAt: expect.any(Date),
      },
      status: 'PAID',
      updatedAt: expect.any(Date),
    });
    expect(updateOrderStatusUseCase.execute).toHaveBeenNthCalledWith(1, {
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      status: 'RECEIVED',
    });
  });
});
