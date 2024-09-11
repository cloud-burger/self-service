import { Order } from '~/domain/order/entities/order';
import { OrderResponse } from './dtos/order-response';
import { OrderPresenter } from './order';

export class ListOrdersPresenter {
  static toHttp(orders: Order[]): OrderResponse[] {
    return orders.map((order) => OrderPresenter.toHttp(order));
  }
}
