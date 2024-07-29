import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Product } from '~/domain/order/entities/product';
import { FindProductByCategoryUseCase } from '~/domain/order/use-cases/find-product-by-category';

export class FindProductByCategoryController {
  constructor(
    private findProductByCategoryUseCase: FindProductByCategoryUseCase
  ) {}

  handler: Controller = async (
      request: Request,
    ): Promise<Response<Product[]>> => {
      const { category } = request.pathParameters;

      logger.info({
        message: 'Find product by category request',
        data: request
      });

      const product = await this.findProductByCategoryUseCase.execute({
        category,
      });

      return {
        statusCode: 200,
        body: product
      };
    }
}