import { env } from '~/app/env';
import { Payment } from '~/domain/payment/entities/payment';
import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';
import { CreatePaymentRequest } from '../dtos/create-payment-request';
import { GetPaymentByIdResponse } from '../dtos/get-payment-by-id-response';

export class MercadoPagoMapper {
  static toHttp(payment: Payment): CreatePaymentRequest {
    const { order } = payment;

    return {
      description: `SELFSERVICE-${order.number}`,
      title: `SELFSERVICE-${order.number}`,
      external_reference: payment.id,
      items: order.products.map((product) => ({
        quantity: product.quantity,
        title: product.name,
        total_amount: product.quantity * product.amount,
        unit_price: product.amount,
        unit_measure: 'unit',
      })),
      notification_url: env.NOTIFICATION_WEBHOOK,
      total_amount: +order.amount,
    };
  }

  static toDomain(paymentData: GetPaymentByIdResponse): Payment {
    const statusMapper = {
      payment_required: PaymentStatus.WAITING_PAYMENT,
      paid: PaymentStatus.PAID,
    };

    return new Payment({
      id: paymentData.external_reference,
      amount: paymentData.total_amount,
      externalId: paymentData.id,
      status: statusMapper[paymentData.order_status],
    });
  }
}
