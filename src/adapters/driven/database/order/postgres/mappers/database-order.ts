import { Order } from '~/domain/order/entities/order';
import { OrderDbSchema } from '../dtos/order-db-schema';
import { ProductDbSchema } from '../dtos/product-db-schema';
import { CustomerDbSchema } from '../../../customer/postgres/dtos/customer-db-schema';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';
import { Customer } from '~/domain/customer/entities/customer';
import { Product } from '~/domain/order/entities/product';
import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';

export class DatabaseOrderMapper {
  static toDomain(
    orderDbSchema: OrderDbSchema, 
    customerDbSchema?: CustomerDbSchema,
    productDbSchema?: ProductDbSchema
  ): Order {
    return new Order({
      id: orderDbSchema.id,
      amount: orderDbSchema.amount,
      customer: orderDbSchema.customer_id ? new Customer({
                                              documentNumber: customerDbSchema.document_number,
                                              name: customerDbSchema.name,
                                              email: customerDbSchema.email,
                                              createdAt: customerDbSchema.created_at,
                                              updatedAt: customerDbSchema.updated_at,}) : null,
      status: orderDbSchema.status as OrderStatus,
      createdAt: orderDbSchema.created_at,
      updatedAt: orderDbSchema.updated_at,
      products: orderDbSchema.products.map((product) => {
        return new Product({
          id: productDbSchema.id,
          amount: +productDbSchema.amount,
          category: productDbSchema.category as ProductCategory,
          description: productDbSchema.description,
          name: productDbSchema.name,
          image: productDbSchema.image,
          createdAt: productDbSchema.created_at,
          updatedAt: productDbSchema.updated_at,
        })
      }),
    });
  }
}