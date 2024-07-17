import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { FindCustomerByDocumentNumberUseCase } from '~/domain/customer/use-cases/find-by-document-number';
import { CustomerRepository } from '~/driven/database/customer/postgres/customer-repository';
import { FindCustomerByDocumentNumberController } from '~/driver/customer/controllers/find-by-document-number';

let pool: Pool;
let customerRepository: CustomerRepository;
let findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase;
let findCustomerByDocumentNumberController: FindCustomerByDocumentNumberController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  customerRepository = new CustomerRepository(connection);
  findCustomerByDocumentNumberUseCase = new FindCustomerByDocumentNumberUseCase(
    customerRepository,
  );
  findCustomerByDocumentNumberController =
    new FindCustomerByDocumentNumberController(
      findCustomerByDocumentNumberUseCase,
    );
  apiHandler = new ApiHandler(findCustomerByDocumentNumberController.handler);
};

export const findCustomerByDocumentNumber = async (
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
