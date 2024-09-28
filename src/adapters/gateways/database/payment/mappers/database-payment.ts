import { Order } from '~/domain/order/entities/order';
import { PaymentsDbSchema } from '../dtos/payment-db-schema';
import { Payment } from '~/domain/payment/entities/payment';
import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';

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
}
