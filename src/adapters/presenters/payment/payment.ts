import { Payment } from '~/domain/payment/entities/payment';
import { PaymentResponse } from './dtos/payment-response';

export class PaymentPresenter {
  static toHttp(payment: Payment): PaymentResponse {
    return {
      amount: payment.amount,
      status: payment.status,
      order: payment.order,
      emv: payment.emv,
      externalId: payment.externalId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
    };
  }
}