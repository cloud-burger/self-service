import { mock, MockProxy } from 'jest-mock-extended';
import { makePayment } from 'tests/factories/make-payment';
import Connection from '~/app/postgres/connection';
import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';
import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';
import { PaymentRepository } from './payment-repository';

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

    const payment = await paymentRepository.findByOrderId('123');

    expect(payment).toBeNull();
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: { order_id: '123' },
      sql: "SELECT * FROM public.payments WHERE order_id = :order_id and status <> 'CANCELED'",
    });
  });

  it('should return payment while find payment by order id', async () => {
    connection.query.mockResolvedValue({
      records: [
        {
          id: '123',
          amount: 23.1,
          order_id: '456',
          emv: '1234COM',
          external_id: 1234567,
          status: PaymentStatus.PAID,
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
        },
      ],
    });

    const payment = await paymentRepository.findByOrderId('456');

    expect(payment).toEqual({
      id: '123',
      amount: 23.1,
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
      sql: "SELECT * FROM public.payments WHERE order_id = :order_id and status <> 'CANCELED'",
    });
  });

  it('should create payment successfully', async () => {
    connection.query.mockResolvedValue({
      records: [],
    });

    await paymentRepository.create(makePayment());

    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: {
        amount: 20.99,
        created_at: '2024-07-12T22:18:26.351Z',
        order_id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        emv: undefined,
        external_id: undefined,
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        status: 'WAITING_PAYMENT',
        updated_at: '2024-07-12T22:18:26.351Z',
      },
      sql: 'INSERT INTO public.payments (id,amount,order_id,status,created_at,updated_at) VALUES (:id,:amount,:order_id,:status,:created_at,:updated_at);',
    });
  });

  it('should update payment successfully', async () => {
    await paymentRepository.update(makePayment());
  });
});
