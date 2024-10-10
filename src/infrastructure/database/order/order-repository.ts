import { InternalServerError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import Connection from '~/api/postgres/connection';
import { Order } from '~/domain/order/entities/order';
import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';
import {
  OrderRepository as IOrderRepository,
  OrderPaginationParams,
} from '~/domain/order/repositories/order';
import { OrderNumber, OrdersDbSchema } from './dtos/orders-db-schema';
import { DatabaseOrderMapper } from './mappers/database-order';
import { FIND_BY_ID } from './queries/find-by-id';
import { FIND_MANY } from './queries/find-many';
import { INSERT_ORDER, INSERT_ORDER_PRODUCT } from './queries/insert';
import { UPDATE_ORDER_STATUS } from './queries/update-status';

export class OrderRepository implements IOrderRepository {
  constructor(private connection: Connection) {}

  async findMany(input: OrderPaginationParams): Promise<Order[]> {
    const { records } = await this.connection.query({
      sql: FIND_MANY(input),
      parameters: { ...input },
    });

    return records.map((orderDbSchema) => {
      return DatabaseOrderMapper.toDomain(orderDbSchema as OrdersDbSchema);
    });
  }

  async create(order: Order): Promise<number> {
    const { products, ...recordToSave } = DatabaseOrderMapper.toDatabase(order);

    const columnsAndParameters = (record: Record<string, any>) => {
      const columns = Object.keys(record);
      const parameters = columns.map((key) => `:${key}`);
      return { columns, parameters };
    };

    const { columns, parameters } = columnsAndParameters(recordToSave);

    await this.connection.begin();
    try {
      const { records } = await this.connection.query({
        sql: INSERT_ORDER(columns.join(), parameters.join()),
        parameters: recordToSave,
      });

      const [order] = records;

      const { number } = order as OrderNumber;

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

      return number;
    } catch (error) {
      await this.connection.rollback();

      logger.error({
        message: 'Error while processing transaction',
        data: error,
      });
      throw new InternalServerError('Error while processing transaction');
    }
  }

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    await this.connection.query({
      sql: UPDATE_ORDER_STATUS,
      parameters: {
        id,
        status,
        updated_at: new Date().toISOString(),
      },
    });
  }

  async findById(id: string): Promise<Order | null> {
    const { records } = await this.connection.query({
      sql: FIND_BY_ID,
      parameters: {
        id,
      },
    });

    if (!records.length) {
      logger.debug({
        message: 'Order does not exists',
        data: {
          id,
        },
      });

      return null;
    }

    const [order] = records;

    return DatabaseOrderMapper.toDomain(order as OrdersDbSchema);
  }
}
