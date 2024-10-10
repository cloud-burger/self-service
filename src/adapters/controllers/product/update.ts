import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { ProductResponse } from '~/presenters/product/dtos/product-response';
import { ProductPresenter } from '~/presenters/product/product';
import { UpdateProductUseCase } from '~/use-cases/product/update';
import { productSchema } from './validations/product-schema';

export class UpdateProductController {
  constructor(private updateProductUseCase: UpdateProductUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<ProductResponse>> => {
    logger.info({
      message: 'Update product request',
      data: request,
    });

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

    logger.info({
      message: 'Update product response',
      data: product,
    });

    return {
      statusCode: 200,
      body: ProductPresenter.toHttp(product),
    };
  };
}
