import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';
import { DatabasePaymentMapper } from './database-payment';
import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';

describe('database payment mapper', () => {
  it('should map to domain', () => {
    expect(
      DatabasePaymentMapper.toDomain({
        id: '123',
        amount: 31,
        order_id: '1376c2b4-74bd-477c-8f44-7cc593e8c734',
        status: PaymentStatus.PAID,
        emv: '00020101021123450016',
        external_id: 1234557,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      }),
    ).toEqual({
      id: '123',
      amount: 31,
      status: PaymentStatus.PAID,
      order: {
        id: '1376c2b4-74bd-477c-8f44-7cc593e8c734',
        status: OrderStatus.WAITING_PAYMENT,
        products: [],
        customer: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      emv: '00020101021123450016',
      externalId: 1234557,
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    });
  });
});