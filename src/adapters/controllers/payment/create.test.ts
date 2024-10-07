import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { makePayment } from 'tests/factories/make-payment';
import { CreatePaymentUseCase } from '~/domain/payment/use-cases/create';
import { CreatePaymentController } from './create';

describe('create payment handler', () => {
  let createPaymentUseCase: MockProxy<CreatePaymentUseCase>;
  let createPaymentController: CreatePaymentController;

  beforeAll(() => {
    createPaymentUseCase = mock();
    createPaymentController = new CreatePaymentController(createPaymentUseCase);
  });

  it('should throw validation error when request is invalid', async () => {
    try {
      await createPaymentController.handler({
        body: {
          orderId: '123',
        },
      } as unknown as Request);
    } catch (error) {
      expect(error.toObject()).toEqual({
        invalidParams: [
          {
            name: 'orderId',
            reason: 'Id do pedido must be a valid GUID',
            value: '123',
          },
        ],
        reason: 'Invalid request data',
      });
    }

    expect(createPaymentUseCase.execute).not.toHaveBeenCalled();
  });

  it('should create payment successfully', async () => {
    createPaymentUseCase.execute.mockResolvedValue(
      makePayment({
        emv: '00020101021243650016COM.MERCADOLIBRE0201306364a9e4780-d0a6-42e8-98d7-f6805209d83a5204000053039865802BR5909Test Test6009SAO PAULO62070503***63041A36',
      }),
    );

    const response = await createPaymentController.handler({
      body: {
        orderId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      },
    } as unknown as Request);

    expect(response).toEqual({
      body: {
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        amount: 'R$\xa020,99',
        emv: '00020101021243650016COM.MERCADOLIBRE0201306364a9e4780-d0a6-42e8-98d7-f6805209d83a5204000053039865802BR5909Test Test6009SAO PAULO62070503***63041A36',
        orderId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        status: 'WAITING_PAYMENT',
      },
      statusCode: 201,
    });
    expect(createPaymentUseCase.execute).toHaveBeenNthCalledWith(1, {
      orderId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    });
  });
});
