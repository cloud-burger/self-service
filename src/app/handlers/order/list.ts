import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { ListOrdersController } from '~/controllers/order/list';
import { OrderRepository } from '~/database/order/order-repository';
import { ListOrdersUseCase } from '~/use-cases/order/list';

let pool: Pool;
let orderRepository: OrderRepository;
let listOrdersUseCase: ListOrdersUseCase;
let listOrdersController: ListOrdersController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  orderRepository = new OrderRepository(connection);
  listOrdersUseCase = new ListOrdersUseCase(orderRepository);
  listOrdersController = new ListOrdersController(listOrdersUseCase);
  apiHandler = new ApiHandler(listOrdersController.handler);
};

export const listOrders = async (
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
