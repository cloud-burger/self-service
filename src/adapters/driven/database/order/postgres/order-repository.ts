import logger from '@cloud-burger/logger';
import Connection from '~/app/postgres/connection';
import { Order } from '~/domain/order/entities/order';
import { OrderRepository as IOrderRepository } from '~/domain/order/repositories/order';
import { OrderDbSchema } from './dtos/order-db-schema';
import { DatabaseOrderMapper } from './mappers/database-order';
import { GET_ORDERS } from './queries/get-orders';

export class OrderRepository implements IOrderRepository {
  constructor(private connection: Connection) {}

  async findMany(input: OrderPaginationParams): Promise<Order[]> {
    const { records } = await this.connection.query({
      sql: FIND_MANY(input),
      parameters: { ...input }
    });

    if (!records.length) {
      // nesse caso pode só retornar array vazio  
      return [];
    }

   
     //esse cara precisa retornar um array de orders por ser uma listagem  
     return records.map((record) => {
      return DatabaseOrderMapper.toDomain(record as OrderDbSchema)
    });
  }
    const { records } = await this.connection.query({
      sql: GET_ORDERS,
    });

    if (!records.length) {
      logger.debug({
        message: 'Orders not found',
        data: {
          records,
        },
      });

      return null;
    }

    const [orders] = records;

    return DatabaseOrderMapper.toDomain(orders as OrderDbSchema);
  }
}
