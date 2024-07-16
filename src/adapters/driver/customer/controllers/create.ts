import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { Customer } from '~/domain/customer/entities/customer';
import { CreateCustomerUseCase } from '~/domain/customer/use-cases/create';
import { createCustomerSchema } from './validations/create-schema';

export class CreateCustomerController {
  constructor(private createCustomerUseCase: CreateCustomerUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<Customer>> => {
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

      throw new ValidationError('Dados inválidos na requisição', errors);
    }

    const customer = await this.createCustomerUseCase.execute(data);

    return {
      statusCode: 201,
      body: customer,
    };
  };
}
