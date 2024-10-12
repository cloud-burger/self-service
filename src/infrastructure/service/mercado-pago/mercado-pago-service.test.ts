import { get, post } from '@cloud-burger/http-wrappers';
import { makePayment } from 'tests/factories/make-payment';
import { MercadoPagoService } from './mercado-pago-service';

jest.mock('@cloud-burger/http-wrappers');

describe('mercado pago service', () => {
  const postMock = jest.mocked(post);
  const getMock = jest.mocked(get);
  let mercadoPagoService: MercadoPagoService;

  beforeAll(() => {
    mercadoPagoService = new MercadoPagoService(
      'http://mercadopago.com.br',
      'tokenzinho',
    );
  });

  it('should create payment successfully', async () => {
    postMock.mockResolvedValue({
      data: {
        in_store_order_id: '4a9e4780-d0a6-42e8-98d7-f6805209d83a',
        qr_data:
          '00020101021243650016COM.MERCADOLIBRE0201306364a9e4780-d0a6-42e8-98d7-f6805209d83a5204000053039865802BR5909Test Test6009SAO PAULO62070503***63041A36',
      },
      status: 200,
    });

    const response = await mercadoPagoService.create(makePayment());

    expect(response).toEqual({
      amount: 20.99,
      createdAt: new Date('2024-07-12T22:18:26.351Z'),
      emv: '00020101021243650016COM.MERCADOLIBRE0201306364a9e4780-d0a6-42e8-98d7-f6805209d83a5204000053039865802BR5909Test Test6009SAO PAULO62070503***63041A36',
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      order: {
        amount: 20.99,
        createdAt: new Date('2024-07-12T22:18:26.351Z'),
        customer: {
          createdAt: new Date('2024-07-12T22:18:26.351Z'),
          documentNumber: '53523992060',
          email: 'johndue@gmail.com',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          name: 'John Due',
          updatedAt: new Date('2024-07-12T22:18:26.351Z'),
        },
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        number: 123,
        products: [
          {
            amount: 20.99,
            category: 'BURGER',
            createdAt: new Date('2024-07-12T22:18:26.351Z'),
            description:
              'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
            id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
            image: null,
            name: 'Bacon Burger',
            notes: 'Sem bacon',
            quantity: 1,
            updatedAt: new Date('2024-07-12T22:18:26.351Z'),
          },
        ],
        status: 'RECEIVED',
        updatedAt: new Date('2024-07-12T22:18:26.351Z'),
      },
      status: 'WAITING_PAYMENT',
      updatedAt: new Date('2024-07-12T22:18:26.351Z'),
    });
    expect(postMock).toHaveBeenNthCalledWith(1, {
      data: {
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
      },
      url: 'http://mercadopago.com.br',
      headers: {
        Authorization: 'Bearer tokenzinho',
      },
    });
  });

  it('should get payment by id successfully', async () => {
    getMock.mockResolvedValue({
      data: {
        id: 22960906837,
        status: 'opened',
        external_reference: 'reference_12345',
        preference_id: '1995444195-fd7a8352-ec20-4eaf-b6ca-77755c2c9fa0',
        payments: [],
        shipments: [],
        payouts: [],
        collector: {
          id: 1995444195,
          email: '',
          nickname: 'TESTUSER1946889786',
        },
        marketplace: 'NONE',
        notification_url:
          'https://webhook.site/c391a9f5-f375-4541-958e-9ece3841eddb',
        date_created: '2024-09-18T16:54:29.298-04:00',
        last_updated: '2024-09-18T16:54:29.298-04:00',
        sponsor_id: null,
        shipping_cost: 0,
        total_amount: 1.01,
        site_id: 'MLB',
        paid_amount: 0,
        refunded_amount: 0,
        payer: null,
        items: [
          {
            id: '',
            category_id: '',
            currency_id: 'BRL',
            description: '',
            picture_url: null,
            title: 'Point Mini',
            quantity: 1,
            unit_price: 1.01,
          },
        ],
        cancelled: false,
        additional_info: '',
        application_id: null,
        is_test: true,
        order_status: 'payment_required',
        client_id: '7785106356073680',
      },
      status: 200,
    });

    const payment = await mercadoPagoService.findByExternalId('22960906837');

    expect(payment).toEqual({
      amount: 1.01,
      createdAt: expect.any(Date),
      externalId: 22960906837,
      id: 'reference_12345',
      status: 'WAITING_PAYMENT',
      updatedAt: expect.any(Date),
    });
    expect(getMock).toHaveBeenNthCalledWith(1, {
      headers: { Authorization: 'Bearer tokenzinho' },
      url: 'http://mercadopago.com.br/22960906837',
    });
  });
});
