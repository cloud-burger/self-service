import { env } from '~/app/env';
import { Payment } from '~/domain/payment/entities/payment';
import { CreatePaymentRequest } from '../dtos/create-payment-request';

export class MercadoPagoMapper {
  static toHttp(payment: Payment): CreatePaymentRequest {
    const { order } = payment;

    return {
      description: `SELFSERVICE-${order.number}`,
      title: `SELFSERVICE-${order.number}`,
      external_reference: order.id,
      items: order.products.map((product) => ({
        quantity: product.quantity,
        title: product.name,
        total_amount: product.quantity * product.amount,
        unit_price: product.amount,
        unit_measure: 'unit',
      })),
      notification_url: env.NOTIFICATION_WEBHOOK,
      total_amount: order.amount,
    };
  }
}
