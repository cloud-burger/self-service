import { mock, MockProxy } from 'jest-mock-extended';
import Connection from '~/app/postgres/connection';
import { PaymentRepository } from './payment-repository';
import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';
import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';
import { makePayment } from 'tests/factories/make-payment';

describe('payment repository', () => {
  let connection: MockProxy<Connection>;
  let paymentRepository: PaymentRepository;

  beforeAll(() => {
    connection = mock();
    paymentRepository = new PaymentRepository(connection);
  });

  it('should return null while payment not found', async () => {
    connection.query.mockResolvedValue({
      records: [],
    });

    const payment =
      await paymentRepository.findByOrderId('123');

    expect(payment).toBeNull();
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: { order_id: '123' },
      sql: 'SELECT * FROM public.payments WHERE order_id = :order_id',
    });
  });

  it('should return payment while find payment by order id', async () => {
    connection.query.mockResolvedValue({
      records: [
        {
          id: '123',
          amount: 23.10,
          order_id: '456',
          emv: '1234COM',
          external_id: 1234567,
          status: PaymentStatus.PAID,
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
        },
      ],
    });

    const payment =
      await paymentRepository.findByOrderId('456');

    expect(payment).toEqual({
      id: '123',
      amount: 23.10,
      status: PaymentStatus.PAID,
      order: {
        id: '456',
        status: OrderStatus.WAITING_PAYMENT,
        products: [],
        customer: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      emv: '1234COM',
      externalId: 1234567,
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    });
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: { order_id: '456' },
      sql: 'SELECT * FROM public.payments WHERE order_id = :order_id',
    });
  });

  it('should create payment successfully', async () => {
    const payment =
      await paymentRepository.create(makePayment());

  });

  it('should update payment successfully', async () => {
    const payment =
      await paymentRepository.update(makePayment());

  });
});
