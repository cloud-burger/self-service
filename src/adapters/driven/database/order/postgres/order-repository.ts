import Connection from '~/app/postgres/connection';
import { Order } from '~/domain/order/entities/order';
import {
  OrderRepository as IOrderRepository,
  OrderPaginationParams,
} from '~/domain/order/repositories/order';
import { OrdersDbSchema } from './dtos/orders-db-schema';
import { DatabaseOrderMapper } from './mappers/database-order';
import { FIND_MANY } from './queries/find-many';

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
}
