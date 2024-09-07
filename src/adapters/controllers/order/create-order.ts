import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { CreateOrderUseCase } from '~/domain/order/use-cases/create-order';
import { OrderResponse } from '~/presenters/order/dtos/order-response';
import { OrderPresenter } from '~/presenters/order/order';
import { orderSchema } from './validations/order-schema';

export class CreateOrderController {
  constructor(private createOrderUseCase: CreateOrderUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<OrderResponse>> => {
    const { body, headers } = request;
    const customerTaxId = headers['x-identification'];

    logger.info({
      message: 'Create order request',
      data: request,
    });

    const { data, errors } = validateSchema(orderSchema, body);

    const hasValidationErrors = errors && errors.length;

    if (hasValidationErrors) {
      logger.warn({
        message: 'Create order validation error',
        data: errors,
      });

      throw new ValidationError('Invalid request data', errors);
    }

    const order = await this.createOrderUseCase.execute({
      customerTaxId: customerTaxId,
      ...data,
    });

    logger.info({
      message: 'Create order response',
      data: order,
    });

    return {
      statusCode: 201,
      body: OrderPresenter.toHttp(order),
    };
  };
}
