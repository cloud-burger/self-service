import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { CreateOrderUseCase } from '~/domain/order/use-cases/create-order';
import { OrderRepository } from '~/driven/database/order/postgres/order-repository';
import { ProductRepository } from '~/driven/database/order/postgres/product-repository';
import { CreateOrderController } from '~/driver/order/controllers/create-order';

let pool: Pool;
let orderRepository: OrderRepository;
let productRepository: ProductRepository;
let createOrderUseCase: CreateOrderUseCase;
let createOrderController: CreateOrderController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  orderRepository = new OrderRepository(connection);
  productRepository = new ProductRepository(connection);
  createOrderUseCase = new CreateOrderUseCase(orderRepository, productRepository);
  createOrderController = new CreateOrderController(createOrderUseCase);
  apiHandler = new ApiHandler(createOrderController.handler);
};

export const createOrder = async (
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
