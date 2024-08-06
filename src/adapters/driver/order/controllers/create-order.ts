import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { CreateOrderUseCase } from '~/domain/order/use-cases/create-order';
import { orderSchema } from './validations/order-schema';
import { Order } from '~/domain/order/entities/order';
  
  export class CreateOrderController {
    constructor(private createOrderUseCase: CreateOrderUseCase) {}
  
    handler: Controller = async (
      request: Request,
    ): Promise<Response<Order>> => {
      const { body, headers } = request;
      const customerId = headers['x-identification'];
  
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
      
      const response = await this.createOrderUseCase.execute({customer: customerId, ...data});
  
      return {
        statusCode: 201,
        body: response
      };
    };
  }
  