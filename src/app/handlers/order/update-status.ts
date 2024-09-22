import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { UpdateOrderStatusController } from '~/controllers/order/update-status';
import { UpdateOrderStatusUseCase } from '~/domain/order/use-cases/update-status';
import { OrderRepository } from '~/gateways/database/order/order-repository';

let pool: Pool;
let orderRepository: OrderRepository;
let updateOrderStatusUseCase: UpdateOrderStatusUseCase;
let updateOrderStatusController: UpdateOrderStatusController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  orderRepository = new OrderRepository(connection);
  updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
  updateOrderStatusController = new UpdateOrderStatusController(
    updateOrderStatusUseCase,
  );
  apiHandler = new ApiHandler(updateOrderStatusController.handler);
};

export const updateOrderStatus = async (
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
