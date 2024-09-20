import { Order } from '../entities/order';
import { OrderPaginationParams, OrderRepository } from '../repositories/order';

export class ListOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(input: OrderPaginationParams): Promise<Order[]> {
    return await this.orderRepository.findMany(input);
  }
}
