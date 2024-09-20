import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { FindProductsByCategoryController } from '~/controllers/order/product/find-by-category';
import { FindProductsByCategoryUseCase } from '~/domain/order/use-cases/product/find-by-category';
import { ProductRepository } from '~/gateways/database/order/product-repository';

let pool: Pool;
let productRepository: ProductRepository;
let findProductsByCategoryUseCase: FindProductsByCategoryUseCase;
let findProductsByCategoryController: FindProductsByCategoryController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  productRepository = new ProductRepository(connection);
  findProductsByCategoryUseCase = new FindProductsByCategoryUseCase(
    productRepository,
  );
  findProductsByCategoryController = new FindProductsByCategoryController(
    findProductsByCategoryUseCase,
  );
  apiHandler = new ApiHandler(findProductsByCategoryController.handler);
};

export const findProductsByCategory = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.setEvent('self-service', request);
  logger.debug({
    message: 'Event received',
    data: request,
  });

  pool = await PoolFactory.getPool();
  const connection = await pool.getConnection();

  setDependencies(connection);

  try {
    return await apiHandler.handler(request, response);
  } finally {
    connection.release();
  }
};
