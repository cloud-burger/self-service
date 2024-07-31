import { Order } from '../entities/order';
import { OrderRepository } from '../repositories/order';
import { OrderPaginationParams } from '~/domain/order/repositories/order'

export class ListOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(input: OrderPaginationParams): Promise<Order[]> {
      return await this.orderRepository.findMany(input);
  }
}