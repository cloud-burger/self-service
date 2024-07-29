import { Order } from '~/domain/order/entities/order';
import { OrderDbSchema } from '../dtos/order-db-schema';

export class DatabaseOrderMapper {
  static toDomain(orderDbSchema: OrderDbSchema): Order {
   export class DatabaseOrderMapper {
  static toDomain(orderDbSchema: OrderDbSchema): Order {
    return new Order({
      id: orderDbSchema.id,
      amount: orderDbSchema.amount,
      customer: orderDbSchema.customer_id ? new Customer({ ...props}) : null
      status: orderDbSchema.status as OrderStatus,
      createdAt: orderDbSchema.created_at,
      updatedAt: orderDbSchema.updated_at,
      products: orderDbSchema.products.map((product) => {
        return new Product({...props})
      }),
    });
  }
}
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
