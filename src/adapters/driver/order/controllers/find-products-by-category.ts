import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';
import { FindProductsByCategoryUseCase } from '~/domain/order/use-cases/find-products-by-category';
import { ProductResponse } from './presenters/dtos/product-response';
import { FindProductsByCategoryPresenter } from './presenters/find-products-by-category';

export class FindProductsByCategoryController {
  constructor(
    private findProductsByCategoryUseCase: FindProductsByCategoryUseCase,
  ) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<ProductResponse[]>> => {
    const { category } = request.pathParameters;

    logger.info({
      message: 'Find product by category request',
      data: request,
    });

    const products = await this.findProductsByCategoryUseCase.execute({
      category: category as ProductCategory,
    });

    return {
      statusCode: 200,
      body: FindProductsByCategoryPresenter.toHttp(products),
    };
  };
}
