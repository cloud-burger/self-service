import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import { env } from '~/app/env';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { CreatePaymentController } from '~/controllers/payment/create';
import { PaymentService } from '~/domain/payment/services/payment';
import { OrderRepository } from '~/gateways/database/order/order-repository';
import { PaymentRepository } from '~/gateways/database/payment/payment-repository';
import { MercadoPagoService } from '~/gateways/http/mercado-pago/mercado-pago-service';
import { CreatePaymentUseCase } from '~/use-cases/payment/create';

let pool: Pool;
let orderRepository: OrderRepository;
let paymentRepository: PaymentRepository;
let createPaymentUseCase: CreatePaymentUseCase;
let paymentServices: PaymentService;
let createPaymentController: CreatePaymentController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  orderRepository = new OrderRepository(connection);
  paymentRepository = new PaymentRepository(connection);
  paymentServices = new MercadoPagoService(
    env.MERCADO_PAGO_CREATE_QR_API_URL,
    env.MERCADO_PAGO_API_TOKEN,
  );
  createPaymentUseCase = new CreatePaymentUseCase(
    paymentServices,
    paymentRepository,
    orderRepository,
  );
  createPaymentController = new CreatePaymentController(createPaymentUseCase);
  apiHandler = new ApiHandler(createPaymentController.handler);
};

export const createPayment = async (
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
