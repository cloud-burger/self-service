import { Payment } from '../entities/payment';

export interface PaymentService {
  create(payment: Payment): Promise<Payment>;
  findByExternalId(id: string): Promise<Payment>;
}
