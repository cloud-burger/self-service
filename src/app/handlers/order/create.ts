import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { CreateOrderController } from '~/controllers/order/create';
import { CustomerRepository } from '~/gateways/database/customer/customer-repository';
import { OrderRepository } from '~/gateways/database/order/order-repository';
import { ProductRepository } from '~/gateways/database/product/product-repository';
import { FindCustomerByDocumentNumberUseCase } from '~/use-cases/customer/find-by-document-number';
import { CreateOrderUseCase } from '~/use-cases/order/create';

let pool: Pool;
let orderRepository: OrderRepository;
let productRepository: ProductRepository;
let customerRepository: CustomerRepository;
let findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase;
let createOrderUseCase: CreateOrderUseCase;
let createOrderController: CreateOrderController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  orderRepository = new OrderRepository(connection);
  productRepository = new ProductRepository(connection);
  customerRepository = new CustomerRepository(connection);
  findCustomerByDocumentNumberUseCase = new FindCustomerByDocumentNumberUseCase(
    customerRepository,
  );
  createOrderUseCase = new CreateOrderUseCase(
    orderRepository,
    productRepository,
    findCustomerByDocumentNumberUseCase,
  );
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
