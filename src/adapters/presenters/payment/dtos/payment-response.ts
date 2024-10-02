import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';
import { Order } from '~/domain/order/entities/order';

export interface PaymentResponse {
  amount: number;
  status: PaymentStatus;
  order?: Order;
  emv?: string;
  externalId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}