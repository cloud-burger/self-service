import { InternalServerError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
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
    const { products, ...recordToSave } = DatabaseOrderMapper.toDatabase(order);

    const columnsAndParameters = (record: Record<string, any>) => {
      const columns = Object.keys(record);
      const parameters = columns.map((key) => `:${key}`);
      return { columns, parameters };
    };

    const { columns, parameters } = columnsAndParameters(recordToSave);

    await this.connection.begin();
    try {
      await this.connection.query({
        sql: INSERT_ORDER(columns.join(), parameters.join()),
        parameters: recordToSave,
      });

      for (const product of products) {
        const { columns: productColumns, parameters: productParameters } =
          columnsAndParameters(product);

        await this.connection.query({
          sql: INSERT_ORDER_PRODUCT(
            productColumns.join(),
            productParameters.join(),
          ),
          parameters: product,
        });
      }

      await this.connection.commit();
    } catch (error) {
      await this.connection.rollback();

      logger.error({
        message: 'Error while processing transaction',
        data: error,
      });
      throw new InternalServerError('Error while processing transaction');
    }
  }
}
