import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { CreateProductController } from '~/controllers/order/create-product';
import { CreateProductUseCase } from '~/domain/order/use-cases/create-product';
import { ProductRepository } from '~/gateways/database/order/product-repository';

let pool: Pool;
let productRepository: ProductRepository;
let createProductUseCase: CreateProductUseCase;
let createProductController: CreateProductController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  productRepository = new ProductRepository(connection);
  createProductUseCase = new CreateProductUseCase(productRepository);
  createProductController = new CreateProductController(createProductUseCase);
  apiHandler = new ApiHandler(createProductController.handler);
};

export const createProduct = async (
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
