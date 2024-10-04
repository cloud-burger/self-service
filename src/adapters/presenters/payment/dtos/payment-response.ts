import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';

export interface PaymentResponse {
  amount: number;
  status: PaymentStatus;
  orderId?: string;
  emv?: string;
  createdAt?: Date;
}