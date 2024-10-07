import { getFormattedCurrency } from '~/controllers/helpers/currency';
import { Payment } from '~/domain/payment/entities/payment';
import { PaymentResponse } from './dtos/payment-response';

export class PaymentPresenter {
  static toHttp(payment: Payment): PaymentResponse {
    return {
      id: payment.id,
      amount: getFormattedCurrency(+payment.amount),
      status: payment.status,
      orderId: payment.order.id,
      emv: payment.emv,
    };
  }
}
