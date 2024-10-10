import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { DeleteProductController } from '~/controllers/product/delete';
import { ProductRepository } from '~/database/product/product-repository';
import { DeleteProductUseCase } from '~/use-cases/product/delete';

let pool: Pool;
let productRepository: ProductRepository;
let deleteProductUseCase: DeleteProductUseCase;
let deleteProductController: DeleteProductController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  productRepository = new ProductRepository(connection);
  deleteProductUseCase = new DeleteProductUseCase(productRepository);
  deleteProductController = new DeleteProductController(deleteProductUseCase);
  apiHandler = new ApiHandler(deleteProductController.handler);
};

export const deleteProduct = async (
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
