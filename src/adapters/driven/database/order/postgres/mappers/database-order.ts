import { Order } from '~/domain/order/entities/order';
import { OrderDbSchema } from '../dtos/order-db-schema';

export class DatabaseOrderMapper {
  static toDomain(orderDbSchema: OrderDbSchema): Order {
    return new Order({
      id: orderDbSchema.id,
      amount: orderDbSchema.amount,
      customer: orderDbSchema.customer,
      status: orderDbSchema.status,
      createdAt: orderDbSchema.createdAt,
      updatedAt: orderDbSchema.updatedAt,
      products: orderDbSchema.products,
    });
  }
}
