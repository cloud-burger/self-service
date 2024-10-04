import {
  Controller,
  Request,
  Response
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { CreatePaymentUseCase } from '~/domain/payment/use-cases/create';
import { PaymentPresenter } from '~/presenters/payment/payment';

export class CreatePaymentController {
  constructor(
    private createPaymentUseCase: CreatePaymentUseCase
  ) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<PaymentResponse>> => {
    const { orderId } = request.body;

    logger.info({
      message: 'Create payment request Order Id: ' + orderId
    });

    const payment = await this.createPaymentUseCase.execute({ orderId });

    return {
      statusCode: 201,
      body: PaymentPresenter.toHttp(payment)
    }
  }
}