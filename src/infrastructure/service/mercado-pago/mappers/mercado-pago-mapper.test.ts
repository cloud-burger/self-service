import { makePayment } from 'tests/factories/make-payment';
import { MercadoPagoMapper } from './mercado-pago-mapper';

describe('mercado pago mapper', () => {
  it('should map payment to create payment request', () => {
    expect(MercadoPagoMapper.toHttp(makePayment())).toEqual({
      description: 'SELFSERVICE-123',
      external_reference: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      items: [
        {
          quantity: 1,
          title: 'Bacon Burger',
          total_amount: 20.99,
          unit_measure: 'unit',
          unit_price: 20.99,
        },
      ],
      notification_url: 'http://localhost:9000',
      title: 'SELFSERVICE-123',
      total_amount: 20.99,
    });
  });
});
