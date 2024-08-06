import { Customer } from '~/domain/customer/entities/customer';
import { Order } from '~/domain/order/entities/order';
import { Product } from '~/domain/order/entities/product';
import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';
import { OrderDbSchema, OrdersDbSchema } from '../dtos/orders-db-schema';

export class DatabaseOrderMapper {
  static toDomain(orderDbSchema: OrdersDbSchema): Order {
    return new Order({
      id: orderDbSchema.id,
      amount: orderDbSchema.amount,
      customer: orderDbSchema.customer_id
        ? new Customer({
            id: orderDbSchema.customer.id,
            documentNumber: orderDbSchema.customer.document_number,
            name: orderDbSchema.customer.name,
            email: orderDbSchema.customer.email,
            createdAt: new Date(orderDbSchema.customer.created_at),
            updatedAt: new Date(orderDbSchema.customer.updated_at),
          })
        : null,
      status: orderDbSchema.status as OrderStatus,
      createdAt: new Date(orderDbSchema.created_at),
      updatedAt: new Date(orderDbSchema.updated_at),
      products: orderDbSchema.products.map((product) => {
        return new Product({
          id: product.id,
          amount: +product.amount,
          category: product.category as ProductCategory,
          description: product.description,
          name: product.name,
          image: product.image,
          createdAt: new Date(product.created_at),
          updatedAt: new Date(product.updated_at),
        });
      }),
    });
  }

  static toDatabase(order: Order): OrderDbSchema {
    return {
      id: order.id,
      amount: order.amount,
      customer_id: order.customer?.id || null,
      status: order.status,
      created_at: order.createdAt.toISOString(),
      updated_at: order.updatedAt.toISOString(),
      products: order.products.map((product) => ({
        order_id: order.id,
        product_id: product.id,
        quantity: product.quantity,
        notes: product.notes || null,
      })),
    };
  }
}
