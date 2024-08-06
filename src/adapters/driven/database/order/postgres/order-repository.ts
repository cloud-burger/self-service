import Connection from '~/app/postgres/connection';
import { Order } from '~/domain/order/entities/order';
import {
  OrderRepository as IOrderRepository,
  OrderPaginationParams,
} from '~/domain/order/repositories/order';
import { OrdersDbSchema } from './dtos/orders-db-schema';
import { DatabaseOrderMapper } from './mappers/database-order';
import { FIND_MANY } from './queries/find-many';
import { INSERT_ORDER, INSERT_ORDER_PRODUCT } from './queries/insert-order';
import logger from '@cloud-burger/logger';

export class OrderRepository implements IOrderRepository {
  constructor(private connection: Connection) {}

  async findMany(input: OrderPaginationParams): Promise<Order[]> {
    const { records } = await this.connection.query({
      sql: FIND_MANY(input),
      parameters: { ...input },
    });

    if (!records.length) {
      return [];
    }

    return records.map((orderDbSchema) => {
      return DatabaseOrderMapper.toDomain(orderDbSchema as OrdersDbSchema);
    });
  }

  async create(order: Order): Promise<void> {
    const {products, ...recordToSave} = DatabaseOrderMapper.toDatabase(order);

    const columns = Object.keys(recordToSave)
      .map((key) => {
        return key;
      });

    const parameters = columns.map((key) => {
      return `:${key}`;
    });

    await this.connection.query({
      sql: INSERT_ORDER(columns.join(), parameters.join()),
      parameters: recordToSave,
    });

    products.map((product) => {
      return {product_id: product.id, quantity: product.quantity || 0, notes: product.notes || null, order_id: order.id};
    });

    for (const product of products) {
      const columns = Object.keys(product)
        .map((key) => {
          return key;
      });

      const parameters = columns.map((key) => {
        return `:${key}`;
      });

      await this.connection.query({
        sql: INSERT_ORDER_PRODUCT(columns.join(), parameters.join()),
        parameters: product,
      });
    }
  }
}
