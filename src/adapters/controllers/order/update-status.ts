import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { OrderResponse } from '~/presenters/order/dtos/order-response';
import { OrderPresenter } from '~/presenters/order/order';
import { UpdateOrderStatusUseCase } from '~/use-cases/order/update-status';
import { updateOrderStatusSchema } from './validations/update-order-status-schema';

export class UpdateOrderStatusController {
  constructor(private updateOrderStatusUseCase: UpdateOrderStatusUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<OrderResponse>> => {
    const { body, params } = request;

    logger.info({
      message: 'Update order status request',
      data: request,
    });

    const { data, errors } = validateSchema(updateOrderStatusSchema, {
      ...body,
      ...params,
    });

    const hasValidationErrors = errors && errors.length;

    if (hasValidationErrors) {
      logger.warn({
        message: 'Update order status validation error',
        data: errors,
      });

      throw new ValidationError('Invalid request data', errors);
    }

    const order = await this.updateOrderStatusUseCase.execute(data);

    logger.info({
      message: 'Update order status response',
      data: order,
    });

    return {
      statusCode: 200,
      body: OrderPresenter.toHttp(order),
    };
  };
}
