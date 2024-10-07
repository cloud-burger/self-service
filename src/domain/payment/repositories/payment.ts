import { Payment } from '../entities/payment';

export interface PaymentRepository {
  create(payment: Payment): Promise<void>;
  update(payment: Payment): Promise<void>;
  findByOrderId(id: string): Promise<Payment | null>;
  findById(id: string): Promise<Payment | null>;
}
