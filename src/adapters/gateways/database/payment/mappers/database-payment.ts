import { Order } from '~/domain/order/entities/order';
import { Payment } from '~/domain/payment/entities/payment';
import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';
import { PaymentsDbSchema } from '../dtos/payment-db-schema';

export class DatabasePaymentMapper {
  static toDomain(paymentDbSchema: PaymentsDbSchema): Payment {
    return new Payment({
      id: paymentDbSchema.id,
      amount: paymentDbSchema.amount,
      order: paymentDbSchema.order_id
        ? new Order({
            id: paymentDbSchema.order_id,
          })
        : null,
      status: paymentDbSchema.status as PaymentStatus,
      emv: paymentDbSchema.emv,
      externalId: paymentDbSchema.external_id,
      createdAt: new Date(paymentDbSchema.created_at),
      updatedAt: new Date(paymentDbSchema.updated_at),
    });
  }

  static toDatabase(payment: Payment): PaymentsDbSchema {
    return {
      id: payment.id,
      amount: +payment.amount,
      order_id: payment.order.id,
      emv: payment.emv,
      external_id: payment.externalId,
      status: payment.status,
      created_at: payment.createdAt.toISOString(),
      updated_at: payment.updatedAt.toISOString(),
    };
  }
}
