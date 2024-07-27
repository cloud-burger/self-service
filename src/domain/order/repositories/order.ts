import { Order } from '../entities/order';

export interface OrderRepository {
  // create(Order: Order): Promise<void>;
  get(): Promise<Order>;
}
