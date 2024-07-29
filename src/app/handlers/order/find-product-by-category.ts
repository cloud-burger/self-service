import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { FindProductByCategoryUseCase } from '~/domain/order/use-cases/find-product-by-category';
import { ProductRepository } from '~/driven/database/order/postgres/product-repository';
import { FindProductByCategoryController } from '~/driver/order/controllers/find-product-by-category';

let pool: Pool;
let productRepository: ProductRepository;
let findProductByCategoryUseCase: FindProductByCategoryUseCase;
let findProductByCategoryController: FindProductByCategoryController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  productRepository = new ProductRepository(connection);
  findProductByCategoryUseCase = new FindProductByCategoryUseCase(
    productRepository
  );
  findProductByCategoryController = new FindProductByCategoryController(
    findProductByCategoryUseCase
  );
  apiHandler = new ApiHandler(findProductByCategoryController.handler);
};

export const findProductByCategory = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    logger.setEvent('self-service', request);
    logger.debug({
      message: 'Event received',
      data: request
    });

    pool = await PoolFactory.getPool();
    const connection = await pool.getConnection();

    setDependencies(connection);

    try {
      return await apiHandler.handler(request, response);
    } finally {
      connection.release();
    }
  }