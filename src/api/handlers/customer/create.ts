import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/api/postgres/connection';
import ConnectionCache from '~/api/redis/connection-cache';
import Pool from '~/api/postgres/pool';
import { PoolFactory } from '~/api/postgres/pool-factory';
import { CreateCustomerController } from '~/controllers/customer/create';
import { CustomerRepository } from '~/infrastructure/database/customer/customer-repository';
import { CreateCustomerUseCase } from '~/use-cases/customer/create';

let pool: Pool;
let customerRepository: CustomerRepository;
let createCustomerUseCase: CreateCustomerUseCase;
let createCustomerController: CreateCustomerController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection, connectionCache: ConnectionCache) => {
  customerRepository = new CustomerRepository(connection, connectionCache);
  createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
  createCustomerController = new CreateCustomerController(
    createCustomerUseCase,
  );
  apiHandler = new ApiHandler(createCustomerController.handler);
};

export const createCustomer = async (
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
