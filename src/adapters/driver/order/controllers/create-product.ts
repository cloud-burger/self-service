import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { Product } from '~/domain/order/entities/product';
import { CreateProductUseCase } from '~/domain/order/use-cases/create-product';
import { productSchema } from './validations/product-schema';

export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<Product>> => {
    const { body } = request;

    logger.info({
      message: 'Create product request',
      data: request,
    });

    const { data, errors } = validateSchema(productSchema, body);

    const hasValidationErrors = errors && errors.length;

    if (hasValidationErrors) {
      logger.warn({
        message: 'Create product validation error',
        data: errors,
      });

      throw new ValidationError('Invalid request data', errors);
    }

    const product = await this.createProductUseCase.execute(data);

    return {
      statusCode: 201,
      body: product,
    };
  };
}