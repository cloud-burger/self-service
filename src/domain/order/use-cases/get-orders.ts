// import { NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Order } from '../entities/order';
import { OrderRepository } from '../repositories/order';

export class GetOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(input: OrderPaginationParams): Promise<Order> {
      return await this.orderRepository.findMany(input);
  }
    const orders = await this.orderRepository.get();

    logger.debug({
      message: 'Orders found',
      data: orders,
    });

    return orders;
  }
}
