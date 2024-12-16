import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/api/postgres/connection';
import Pool from '~/api/postgres/pool';
import { PoolFactory } from '~/api/postgres/pool-factory';
import { FindCustomerByDocumentNumberController } from '~/controllers/customer/find-by-document-number';
import { CustomerRepository } from '~/infrastructure/database/customer/customer-repository';
import { FindCustomerByDocumentNumberUseCase } from '~/use-cases/customer/find-by-document-number';

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
