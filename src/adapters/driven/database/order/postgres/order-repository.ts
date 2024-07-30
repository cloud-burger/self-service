import Connection from '~/app/postgres/connection';
import { Order } from '~/domain/order/entities/order';
import { OrderRepository as IOrderRepository } from '~/domain/order/repositories/order';
import { OrderDbSchema } from './dtos/order-db-schema';
import { DatabaseOrderMapper } from './mappers/database-order';
import { FIND_MANY } from './queries/get-orders';
import { OrderPaginationParams } from '~/domain/order/repositories/order'

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
}
