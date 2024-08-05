import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { Product } from '~/domain/order/entities/product';
import { DeleteProductUseCase } from '~/domain/order/use-cases/delete-product';
import { productSchema } from './validations/product-schema';

export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<Product>> => {
    const { body, pathParameters } = request;
    const { id } = pathParameters;

    if (!id) {
      logger.warn({
        message: 'Delete product validation error',
        data: id,
      });

      throw new ValidationError('Invalid request parameter', []);
    }

    const deleted = await this.deleteProductUseCase.execute({
      id
    });

    return {
      statusCode: deleted ? 400 : 200
    };
  };
}
