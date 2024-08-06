import { Order } from '../entities/order';

export interface OrderPaginationParams {
  page: string;
  size: string;
  status?: string;
}

export interface OrderRepository {
  findMany(input: OrderPaginationParams): Promise<Order[]>;
  create(order: Order): Promise<void>;
}
