import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { CreateCustomerUseCase } from '~/domain/customer/use-cases/create';
import { CustomerRepository } from '~/driven/database/customer/postgres/customer-repository';
import { CreateCustomerController } from '~/driver/customer/controllers/create';

let pool: Pool;
let customerRepository: CustomerRepository;
let createCustomerUseCase: CreateCustomerUseCase;
let createCustomerController: CreateCustomerController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  customerRepository = new CustomerRepository(connection);
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
  /*  #swagger.requestBody = {
      "content": {
        "application/json": {
          "schema": {
              "type": "object",
              "properties": {
                "name": {
                    "type": "string",
                },
                "documentNumber": {
                    "type": "string",
                }
              }
            }
          }
        }
      }
  */
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
