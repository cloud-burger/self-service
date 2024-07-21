import { OrderRepository } from '../repositories/order';

export class CreateOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  execute = () => {};
}
