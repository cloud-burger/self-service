import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { GetStatusByOrderUseCase } from '~/domain/payment/use-cases/get-status-by-order';
import { PaymentStatusResponse } from '~/presenters/payment/dtos/payment-status-response';
import { GetPaymentStatusByOrderPresenter } from '~/presenters/payment/get-payment-status-by-order';

export class GetStatusByOrderController {
  constructor(
    private getStatusByOrderUseCase: GetStatusByOrderUseCase
  ) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<PaymentStatusResponse>> => {
    const { orderId } = request.pathParameters;

    logger.info({
      message: 'Get status by order id request',
      data: request,
    });

    const payment = await this.getStatusByOrderUseCase.execute({
      orderId,
    });

    return {
      statusCode: 200,
      body: GetPaymentStatusByOrderPresenter.toHttp(payment),
    };
  };
}
