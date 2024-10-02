import { Payment } from '~/domain/payment/entities/payment';
import { PaymentStatusResponse } from './dtos/payment-status-response';

export class GetPaymentStatusByOrderPresenter {
  static toHttp(payment: Payment): PaymentStatusResponse {
    return {
      id: payment.id,
      status: payment.status
    };
  }
}
