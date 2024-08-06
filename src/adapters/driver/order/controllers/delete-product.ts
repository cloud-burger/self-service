import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Product } from '~/domain/order/entities/product';
import { DeleteProductUseCase } from '~/domain/order/use-cases/delete-product';

export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<Product>> => {
    const { id } = request.pathParameters;

    logger.info({
      message: 'Delete product request',
      data: request,
    });

    await this.deleteProductUseCase.execute({
      id,
    });

    logger.info('Delete product response');

    return {
      statusCode: 204,
    };
  };
}
