import logger from '@cloud-burger/logger';
import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';
import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';
import { PaymentRepository } from '~/domain/payment/repositories/payment';
import { PaymentService } from '~/domain/payment/services/payment';
import { UpdateOrderStatusUseCase } from '../order/update-status';

interface Input {
  externalId: string;
}

export class ProcessEventUseCase {
  constructor(
    private paymentService: PaymentService,
    private paymentRepository: PaymentRepository,
    private updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  async execute({ externalId }: Input): Promise<void> {
    try {
      const externalPayment =
        await this.paymentService.findByExternalId(externalId);

      const payment = await this.paymentRepository.findById(externalPayment.id);

      logger.debug({
        message: 'Set payment info',
        data: {
          payment,
          externalPayment,
        },
      });

      await this.paymentRepository.update(externalPayment);

      if (externalPayment.status === PaymentStatus.PAID) {
        logger.debug('Update order status');

        await this.updateOrderStatusUseCase.execute({
          id: payment.order.id,
          status: OrderStatus.RECEIVED,
        });
      }
    } catch (error) {
      logger.error({
        message: 'Unknown error while process event',
        data: error,
      });

      return;
    }
  }
}
