import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { CreatePaymentUseCase } from '~/domain/payment/use-cases/create';
import { PaymentResponse } from '~/presenters/payment/dtos/payment-response';
import { PaymentPresenter } from '~/presenters/payment/payment';
import { createPaymentSchema } from './validations/create-schema';

export class CreatePaymentController {
  constructor(private createPaymentUseCase: CreatePaymentUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<PaymentResponse>> => {
    logger.info({
      message: 'Create payment request',
      data: request,
    });

    const { data, errors } = validateSchema(createPaymentSchema, request.body);

    const hasValidationErrors = errors && errors.length;

    if (hasValidationErrors) {
      logger.warn({
        message: 'Create payment validation error',
        data: errors,
      });

      throw new ValidationError('Invalid request data', errors);
    }

    const payment = await this.createPaymentUseCase.execute(data);

    logger.info({
      message: 'Create payment response',
      data: payment,
    });

    return {
      statusCode: 201,
      body: PaymentPresenter.toHttp(payment),
    };
  };
}
