import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { UpdateOrderStatusController } from '~/controllers/order/update-status';
import { UpdateOrderStatusUseCase } from '~/domain/order/use-cases/update-status';
import { OrderRepository } from '~/gateways/database/order/order-repository';
import { MercadoPagoService } from '~/gateways/http/mercado-pago/mercado-pago-service';

let pool: Pool;
let orderRepository: OrderRepository;
let updateOrderStatusUseCase: UpdateOrderStatusUseCase;
let updateOrderStatusController: UpdateOrderStatusController;
let apiHandler: ApiHandler;
let mercadoPagoService: MercadoPagoService;

const setDependencies = (connection: Connection) => {
  orderRepository = new OrderRepository(connection);
  updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
  updateOrderStatusController = new UpdateOrderStatusController(
    updateOrderStatusUseCase,
  );
  apiHandler = new ApiHandler(updateOrderStatusController.handler);
  const urlMP = `https://api.mercadolibre.com/merchant_orders`;
  const tokenMP =
    'Bearer APP_USR-7785106356073680-091816-d1c29245fbb399a70031428b1c22463c-1995444195';

  mercadoPagoService = new MercadoPagoService(urlMP, tokenMP);
};

export const paymentReceiver = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  logger.setEvent('self-service', req);
  logger.debug({
    message: 'Event received',
    data: req,
  });

  pool = await PoolFactory.getPool();
  const connection = await pool.getConnection();

  setDependencies(connection);

  const { id } = req.body;

  const foundPayment = await mercadoPagoService.findByExternalId(id);

  logger.debug({
    message: 'Found foundPayment data',
    data: foundPayment,
  });

  return res.status(204);
};
