import { Request, Response } from 'express';
import Connection from '~/app/postgres/connection';
import { OrderRepository } from '~/gateways/database/order/order-repository';
import logger from '@cloud-burger/logger';
import { PoolFactory } from '~/app/postgres/pool-factory';
import Pool from '~/app/postgres/pool';
import { MercadoPagoService } from '~/gateways/http/mercado-pago/mercado-pago-service';
import { Payment } from '~/domain/payment/entities/payment';
import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';

let pool: Pool;
let orderRepository: OrderRepository;
let mercadoPagoService: MercadoPagoService;

const setDependencies = (connection: Connection) => {
  const user_id = '1995444195';
  const external_pos_id = 'SELFSERVICE2024';

  const urlMP = `https://api.mercadopago.com/instore/orders/qr/seller/collectors/${user_id}/pos/${external_pos_id}/qrs`;
  const tokenMP = 'Bearer APP_USR-7785106356073680-091816-d1c29245fbb399a70031428b1c22463c-1995444195';

  mercadoPagoService = new MercadoPagoService(urlMP, tokenMP);
};

export const createPayment = async (request: Request, response: Response): Promise<Response> => {
  logger.setEvent('self-service', request);
  logger.debug({
    message: 'Event received',
    data: request,
  });

  pool = await PoolFactory.getPool();
  const connection = await pool.getConnection();

  setDependencies(connection);

  const order = await orderRepository.findById(orderId);

  const payment = await mercadoPagoService.create(new Payment({
    amount: order.amount,
    status: PaymentStatus.WAITING_PAYMENT,
    order: order,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  logger.debug({
    message: 'payment',
    data: payment,
  });

  return response.status(201).json(payment);
}
