import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import { env } from '~/app/env';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { EventController } from '~/controllers/payment/event';
import { OrderRepository } from '~/database/order/order-repository';
import { PaymentRepository } from '~/database/payment/payment-repository';
import { PaymentService } from '~/domain/payment/services/payment';
import { MercadoPagoService } from '~/service/mercado-pago/mercado-pago-service';
import { UpdateOrderStatusUseCase } from '~/use-cases/order/update-status';
import { ProcessEventUseCase } from '~/use-cases/payment/process-event';

let pool: Pool;
let paymentService: PaymentService;
let paymentRepository: PaymentRepository;
let orderRepository: OrderRepository;
let updateOrderStatusUseCase: UpdateOrderStatusUseCase;
let processEventUseCase: ProcessEventUseCase;
let eventController: EventController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  paymentService = new MercadoPagoService(
    env.MERCADO_PAGO_GET_QR_INFO_API_URL,
    env.MERCADO_PAGO_API_TOKEN,
  );
  paymentRepository = new PaymentRepository(connection);
  orderRepository = new OrderRepository(connection);
  updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
  processEventUseCase = new ProcessEventUseCase(
    paymentService,
    paymentRepository,
    updateOrderStatusUseCase,
  );
  eventController = new EventController(processEventUseCase);
  apiHandler = new ApiHandler(eventController.handler);
};

export const webhook = async (
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
