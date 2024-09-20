import { Order } from '../entities/order';
import { OrderStatus } from '../entities/value-objects/enums/order-status';

export interface OrderPaginationParams {
  page: string;
  size: string;
  status?: string;
}

export interface OrderRepository {
  findMany(input: OrderPaginationParams): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  create(order: Order): Promise<number>;
  updateStatus(id: string, status: OrderStatus): Promise<void>;
}
