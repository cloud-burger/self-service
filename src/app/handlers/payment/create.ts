import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { CreatePaymentController } from '~/controllers/payment/create';
import { CreatePaymentUseCase } from '~/domain/payment/use-cases/create';
import { OrderRepository } from '~/gateways/database/order/order-repository';
import { PaymentRepository } from '~/gateways/database/payment/payment-repository';
import { PaymentService } from '~/domain/payment/services/payment';
import { MercadoPagoService } from '~/gateways/http/mercado-pago/mercado-pago-service';
import { env } from '~/app/env';

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
  paymentServices = new MercadoPagoService(getURLPaymentCreate(), 'Bearer ' + env.MERCADO_PAGO_API_TOKEN)
  createPaymentUseCase = new CreatePaymentUseCase(paymentServices, paymentRepository, orderRepository);
  createPaymentController = new CreatePaymentController(
    createPaymentUseCase
  );
  apiHandler = new ApiHandler(createPaymentController.handler);
};

export const createPayment = async (
  request: Request,
  response: Response
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
}

function getURLPaymentCreate() {
  const external_pos_id = 'SELFSERVICE2024';

  return env.MERCADO_PAGO_URL + `/instore/orders/qr/seller/collectors/${env.MERCADO_PAGO_USER_ID}/pos/${external_pos_id}/qrs`;
}
