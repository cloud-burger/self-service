import { mock, MockProxy } from 'jest-mock-extended';
import { makeOrder } from 'tests/factories/make-order';
import { makePayment } from 'tests/factories/make-payment';
import { OrderRepository } from '~/domain/order/repositories/order';
import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';
import { PaymentRepository } from '~/domain/payment/repositories/payment';
import { PaymentService } from '~/domain/payment/services/payment';
import { CreatePaymentUseCase } from './create';

describe('create payment use case', () => {
  let paymentService: MockProxy<PaymentService>;
  let paymentRepository: MockProxy<PaymentRepository>;
  let orderRepository: MockProxy<OrderRepository>;
  let createPaymentUseCase: CreatePaymentUseCase;

  beforeAll(() => {
    paymentService = mock();
    paymentRepository = mock();
    orderRepository = mock();
    createPaymentUseCase = new CreatePaymentUseCase(
      paymentService,
      paymentRepository,
      orderRepository,
    );
  });

  it('should throw conflict error when payment already has been confirmed', async () => {
    paymentRepository.findByOrderId.mockResolvedValue(
      makePayment({ status: PaymentStatus.PAID }),
    );

    await expect(
      createPaymentUseCase.execute({
        orderId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      }),
    ).rejects.toThrow('Payment already confirmed');

    expect(paymentRepository.findByOrderId).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
  });

  it('should return existent payment', async () => {
    paymentRepository.findByOrderId.mockResolvedValue(makePayment());

    const payment = await createPaymentUseCase.execute({
      orderId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    });

    expect(payment).toEqual({
      amount: 20.99,
      createdAt: expect.any(Date),
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
    expect(paymentRepository.findByOrderId).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(paymentRepository.create).not.toHaveBeenCalled();
  });

  it('should throw not found error when order does not exists', async () => {
    paymentRepository.findByOrderId.mockResolvedValue(null);
    orderRepository.findById.mockResolvedValue(null);

    await expect(
      createPaymentUseCase.execute({
        orderId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      }),
    ).rejects.toThrow('Order not found');

    expect(paymentRepository.findByOrderId).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(orderRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
  });

  it('should create payment successfully', async () => {
    paymentRepository.findByOrderId.mockResolvedValue(null);
    orderRepository.findById.mockResolvedValue(makeOrder());
    paymentService.create.mockResolvedValue(
      makePayment({
        emv: '00020101021243650016COM.MERCADOLIBRE0201306364a9e4780-d0a6-42e8-98d7-f6805209d83a5204000053039865802BR5909Test Test6009SAO PAULO62070503***63041A36',
      }),
    );

    const payment = await createPaymentUseCase.execute({
      orderId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    });

    expect(payment).toEqual({
      amount: 20.99,
      createdAt: expect.any(Date),
      emv: '00020101021243650016COM.MERCADOLIBRE0201306364a9e4780-d0a6-42e8-98d7-f6805209d83a5204000053039865802BR5909Test Test6009SAO PAULO62070503***63041A36',
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

    expect(paymentRepository.findByOrderId).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(orderRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(paymentService.create).toHaveBeenNthCalledWith(1, {
      amount: 20.99,
      createdAt: expect.any(Date),
      id: expect.any(String),
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
    expect(paymentRepository.create).toHaveBeenNthCalledWith(1, {
      amount: 20.99,
      createdAt: expect.any(Date),
      emv: '00020101021243650016COM.MERCADOLIBRE0201306364a9e4780-d0a6-42e8-98d7-f6805209d83a5204000053039865802BR5909Test Test6009SAO PAULO62070503***63041A36',
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
  });
});
