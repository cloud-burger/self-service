import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { Order } from '~/domain/order/entities/order';
import { CreateOrderUseCase } from '~/domain/order/use-cases/create-order';
import { orderSchema } from './validations/order-schema';

export class CreateOrderController {
  constructor(private createOrderUseCase: CreateOrderUseCase) {}

  handler: Controller = async (request: Request): Promise<Response<Order>> => {
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

    const response = await this.createOrderUseCase.execute({
      customerTaxId: customerTaxId,
      ...data,
    });

    logger.info({
      message: 'Create order response',
      data: response,
    });

    return {
      statusCode: 201,
      body: response,
    };
  };
}
