import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/api/postgres/connection';
import ConnectionCache from '~/api/redis/connection-cache';
import Pool from '~/api/postgres/pool';
import { PoolFactory } from '~/api/postgres/pool-factory';
import { FindProductsByCategoryController } from '~/controllers/product/find-by-category';
import { ProductRepository } from '~/infrastructure/database/product/product-repository';
import { FindProductsByCategoryUseCase } from '~/use-cases/product/find-by-category';

let pool: Pool;
let productRepository: ProductRepository;
let findProductsByCategoryUseCase: FindProductsByCategoryUseCase;
let findProductsByCategoryController: FindProductsByCategoryController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection, connectionCache: ConnectionCache) => {
  productRepository = new ProductRepository(connection, connectionCache);
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
  const connectionCache = new ConnectionCache();

  setDependencies(connection, connectionCache);

  try {
    return await apiHandler.handler(request, response);
  } finally {
    connection.release();
  }
};
