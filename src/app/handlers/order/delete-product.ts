import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { DeleteProductUseCase } from '~/domain/order/use-cases/delete-product';
import { ProductRepository } from '~/driven/database/order/postgres/product-repository';
import { DeleteProductController } from '~/driver/order/controllers/delete-product';

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
