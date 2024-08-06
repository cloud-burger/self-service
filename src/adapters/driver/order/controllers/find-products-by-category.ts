import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Product } from '~/domain/order/entities/product';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';
import { FindProductsByCategoryUseCase } from '~/domain/order/use-cases/find-products-by-category';

export class FindProductsByCategoryController {
  constructor(
    private findProductsByCategoryUseCase: FindProductsByCategoryUseCase,
  ) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<Product[]>> => {
    const { category } = request.pathParameters;

    logger.info({
      message: 'Find product by category request',
      data: request,
    });

    const product = await this.findProductsByCategoryUseCase.execute({
      category: category as ProductCategory,
    });

    return {
      statusCode: 200,
      body: product,
    };
  };
}
