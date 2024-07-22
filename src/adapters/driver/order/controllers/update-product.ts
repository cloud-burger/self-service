import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { Product } from '~/domain/order/entities/product';
import { UpdateProductUseCase } from '~/domain/order/use-cases/update-product';
import { productSchema } from './validations/product-schema';

export class UpdateProductController {
  constructor(private updateProductUseCase: UpdateProductUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<Product>> => {
    const { body, pathParameters } = request;
    const { id } = pathParameters;

    const { data, errors } = validateSchema(productSchema, body);

    const hasValidationErrors = errors && errors.length;

    if (hasValidationErrors) {
      logger.warn({
        message: 'Update product validation error',
        data: errors,
      });

      throw new ValidationError('Invalid request data', errors);
    }

    const product = await this.updateProductUseCase.execute({
      id,
      ...data,
    });

    return {
      statusCode: 200,
      body: product,
    };
  };
}
