import { HandlePaymentWebhook } from '~/domain/payment/services/handle-payment-webhook';
import { Request, Response } from 'express';
import Pool from '~/app/postgres/pool';
import { OrderRepository } from '~/gateways/database/order/order-repository';
import { UpdateOrderStatusUseCase } from '~/domain/order/use-cases/update-status';
import { UpdateOrderStatusController } from '~/controllers/order/update-status';
import { ApiHandler } from '@cloud-burger/handlers';
import Connection from '~/app/postgres/connection';
import logger from '@cloud-burger/logger';
import { PoolFactory } from '~/app/postgres/pool-factory';
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

  const order_id = '23137851625';

  const urlMP = `https://api.mercadolibre.com/merchant_orders`;
  const tokenMP = 'Bearer APP_USR-7785106356073680-091816-d1c29245fbb399a70031428b1c22463c-1995444195';

  mercadoPagoService = new MercadoPagoService(urlMP, tokenMP);
};

export const paymentReceiver = async (req: Request, res: Response): Promise<Response> => {
  logger.setEvent('self-service', req);
  logger.debug({
    message: 'Event received',
    data: req,
  });

  pool = await PoolFactory.getPool();
  const connection = await pool.getConnection();

  setDependencies(connection);

  const {id} = req.body;

  const foundPayment = await mercadoPagoService.findByExternalId(id);

  logger.debug({
    message: 'Found foundPayment data',
    data: foundPayment,
  });

  //buscar o pedido
  //atualizar o status e salvar o external id no pedido

  return res.status(204);
}
