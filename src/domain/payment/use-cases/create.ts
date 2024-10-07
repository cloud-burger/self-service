import { ConflictError, NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { OrderRepository } from '~/domain/order/repositories/order';
import { Payment } from '~/domain/payment/entities/payment';
import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';
import { PaymentRepository } from '~/domain/payment/repositories/payment';
import { PaymentService } from '~/domain/payment/services/payment';

interface Input {
  orderId: string;
}

export class CreatePaymentUseCase {
  constructor(
    private paymentService: PaymentService,
    private paymentRepository: PaymentRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({ orderId }: Input): Promise<Payment> {
    const existentPayment = await this.paymentRepository.findByOrderId(orderId);

    if (existentPayment) {
      const isOrderAlreadyPaid = existentPayment.status === PaymentStatus.PAID;

      if (isOrderAlreadyPaid) {
        logger.warn({
          message: 'Payment already confirmed',
          data: existentPayment,
        });

        throw new ConflictError('Payment already confirmed');
      }

      logger.debug({
        message: 'Order already have a existent payment',
        data: existentPayment,
      });

      return existentPayment;
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      logger.warn({
        message: 'Order not found',
        data: { orderId },
      });

      throw new NotFoundError('Order not found');
    }

    const payment = await this.paymentService.create(
      new Payment({
        amount: order.amount,
        order: order,
      }),
    );

    await this.paymentRepository.create(payment);

    logger.debug({
      message: 'Payment created',
      data: payment,
    });

    return payment;
  }
}
