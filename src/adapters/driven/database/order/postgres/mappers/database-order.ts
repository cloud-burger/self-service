import { Order } from '~/domain/order/entities/order';
import { OrderDbSchema } from '../dtos/order-db-schema';
import { Customer } from '~/domain/customer/entities/customer';
import { Product } from '~/domain/order/entities/product';
import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';

export class DatabaseOrderMapper {
  static toDomain(orderDbSchema: OrderDbSchema): Order {
    return new Order({
      id: orderDbSchema.id,
      amount: orderDbSchema.amount,
      customer: orderDbSchema.customer_id ? new Customer({...props}) : null,
      status: orderDbSchema.status as OrderStatus,
      createdAt: orderDbSchema.created_at,
      updatedAt: orderDbSchema.updated_at,
      products: orderDbSchema.products.map((product) => {
        return new Product({...props})
      }),
    });
  }
}