import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { UpdateProductController } from '~/controllers/order/product/update';
import { UpdateProductUseCase } from '~/domain/order/use-cases/product/update';
import { ProductRepository } from '~/gateways/database/product/product-repository';

let pool: Pool;
let productRepository: ProductRepository;
let updateProductUseCase: UpdateProductUseCase;
let updateProductController: UpdateProductController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  productRepository = new ProductRepository(connection);
  updateProductUseCase = new UpdateProductUseCase(productRepository);
  updateProductController = new UpdateProductController(updateProductUseCase);
  apiHandler = new ApiHandler(updateProductController.handler);
};

export const updateProduct = async (
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
