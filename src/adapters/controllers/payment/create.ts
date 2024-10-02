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
    logger.info({
      message: 'Create payment request',
      data: request,
    });

    const { orderId } = request.pathParameters;

    const payment = await this.createPaymentUseCase.execute({ orderId });

    return {
      statusCode: 201,
      body: PaymentPresenter.toHttp(payment)
    }
  }
}