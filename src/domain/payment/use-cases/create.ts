import { Payment } from '~/domain/payment/entities/payment';
import { OrderRepository } from '~/domain/order/repositories/order';
import { PaymentRepository } from '~/domain/payment/repositories/payment';
import { PaymentStatus } from '~/domain/payment/entities/value-objects/payment-status';
import logger from '@cloud-burger/logger';
import { ConflictError } from '@cloud-burger/handlers';
import { PaymentService } from '~/domain/payment/services/payment';

interface Input {
  orderId: string;
}

export class CreatePaymentUseCase {
  constructor(
    private paymentServices: PaymentService,
    private paymentRepository: PaymentRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({ orderId }: Input): Promise<Payment> {
    const payment = await this.paymentRepository.findByOrderId(orderId);

    if (payment) {
      validatePayment(payment);
    }

    const order = await this.orderRepository.findById(orderId);

    let newPayment = await this.paymentServices.create(new Payment({
      amount: order.amount,
      status: PaymentStatus.WAITING_PAYMENT,
      order: order,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await this.paymentRepository.create(newPayment);

    logger.debug({
      message: 'Payment created',
      data: newPayment,
    });

    return newPayment;
  }
}

function validatePayment(payment: Payment) {
  let messageError = 'Generic Error';

  if (payment.status == PaymentStatus.PAID) {
    messageError = 'Payment already confirmed';
  }

  if (payment.status == PaymentStatus.WAITING_PAYMENT) {
    messageError = 'Already exist payment in progress or waiting payment';
  }

  logger.warn({message: messageError, data: payment});

  throw new ConflictError(messageError);
}