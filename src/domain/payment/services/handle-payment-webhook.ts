import { PaymentRepository } from '../repositories/payment';

export class HandlePaymentWebhook {

  constructor(paymentRepo: PaymentRepository) {}

  async execute(paymentId: string, status: string): Promise<void> {
    const payment = await this.paymentRepo.findById(paymentId);
    if (payment) {
      await this.paymentRepo.updateStatus(paymentId, status);
    }
  }
}
