import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { Order } from '~/domain/order/entities/order';
import { ListOrdersUseCase } from '~/domain/order/use-cases/list-orders';
import { listOrdersSchema } from './validations/list-orders-schema';

export class ListOrdersController {
  constructor(private listOrdersUseCase: ListOrdersUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<Order[]>> => {
    logger.info({
      message: 'List orders request',
      data: request,
    });

    const { data, errors } = validateSchema(listOrdersSchema, {
      ...request.params,
    });

    const hasValidationErrors = errors && errors.length;

    if (hasValidationErrors) {
      logger.warn({
        message: 'List orders validation error',
        data: errors,
      });

      throw new ValidationError('Invalid request data', errors);
    }

    const orders = await this.listOrdersUseCase.execute({
      status: data.status,
      page: String(data.pageNumber - 1),
      size: String(data.pageSize),
    });

    logger.info({
      message: 'List orders response',
      data: request,
    });

    return {
      statusCode: 200,
      body: orders,
    };
  };
}
