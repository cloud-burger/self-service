import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { CreateCustomerUseCase } from '~/domain/customer/use-cases/create';
import { CustomerPresenter } from './presenter/customer';
import { CustomerResponse } from './presenter/dtos/customer-response';
import { createCustomerSchema } from './validations/create-schema';

export class CreateCustomerController {
  constructor(private createCustomerUseCase: CreateCustomerUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<CustomerResponse>> => {
    const { body } = request;

    logger.info({
      message: 'Create customer request',
      data: request,
    });

    const { data, errors } = validateSchema(createCustomerSchema, body);

    const hasValidationErrors = errors && errors.length;

    if (hasValidationErrors) {
      logger.warn({
        message: 'Create customer validation error',
        data: errors,
      });

      throw new ValidationError('Invalid request data', errors);
    }

    const customer = await this.createCustomerUseCase.execute(data);

    return {
      statusCode: 201,
      body: CustomerPresenter.toHttp(customer),
    };
  };
}
