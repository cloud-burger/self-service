import { NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Payment } from '~/domain/payment/entities/payment';
import { PaymentRepository } from '~/domain/payment/repositories/payment';

interface Input {
  orderId: string;
}

export class GetStatusByOrderUseCase {
  constructor(private paymentRepository: PaymentRepository) {}

  async execute({ orderId }: Input): Promise<Payment> {
    const payment = await this.paymentRepository.findByOrderId(orderId);

    if (!payment) {
      logger.warn({
        message: 'Payment not found',
        data: {
          orderId,
        },
      });

      throw new NotFoundError('Payment not found');
    }

    logger.debug({
      message: 'Payment found',
      data: payment,
    });

    return payment;
  }
}
