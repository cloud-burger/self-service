import { Order } from '../entities/order';

export interface OrderPaginationParams {
  page: string;
  size: string;
  customerId?: string
  status?: string
}

export interface OrderRepository {
  findMany(input: OrderPaginationParams): Promise<Order>;
}

export interface OrderRepository {
  // create(Order: Order): Promise<void>;
  get(): Promise<Order>;
}
