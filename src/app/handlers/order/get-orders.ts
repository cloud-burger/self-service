import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';

import { GetOrdersUseCase } from '~/domain/order/use-cases/get-orders';
import { OrderRepository } from '~/driven/database/order/postgres/order-repository';
import { GetOrdersController } from '~/driver/order/controllers/get-orders';

let pool: Pool;
let orderRepository: OrderRepository;
let getOrdersUseCase: GetOrdersUseCase;
let getOrdersController: GetOrdersController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  orderRepository = new OrderRepository(connection);
  getOrdersUseCase = new GetOrdersUseCase(
    orderRepository,
  );
  getOrdersController =
    new GetOrdersController(
      getOrdersUseCase,
    );
  apiHandler = new ApiHandler(getOrdersController.handler);
};

export const getOrders = async (
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
