import { ConflictError, NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Order } from '../entities/order';
import { OrderStatus } from '../entities/value-objects/enums/order-status';
import { OrderRepository } from '../repositories/order';

interface Input {
  id: string;
  status: OrderStatus;
}

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(input: Input): Promise<Order> {
    const order = await this.orderRepository.findById(input.id);

    if (!order) {
      logger.warn({
        message: 'Order not found',
        data: input,
      });

      throw new NotFoundError('Order not found');
    }

    if (OrderStatus.FINISHED === order.status) {
      logger.warn({
        message: 'Order has already been finished',
      });

      throw new ConflictError('Order has already been finished');
    }

    order.setStatus(input.status);

    await this.orderRepository.updateStatus(input.id, input.status);

    return order;
  }
}
