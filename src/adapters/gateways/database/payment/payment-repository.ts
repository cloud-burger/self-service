import logger from '@cloud-burger/logger';
import Connection from '~/app/postgres/connection';
import { PaymentRepository as IPaymentRepository } from '~/domain/payment/repositories/payment';
import { Payment } from '~/domain/payment/entities/payment';
import { FIND_BY_ORDER_ID } from './queries/find-by-order-id';
import { PaymentsDbSchema } from './dtos/payment-db-schema';
import { DatabasePaymentMapper } from './mappers/database-payment';
import { InternalServerError } from '@cloud-burger/handlers';
import { INSERT_PAYMENT } from '~/gateways/database/payment/queries/insert';

export class PaymentRepository implements IPaymentRepository {
  constructor(private connection: Connection) {}

  async findByOrderId(id: string): Promise<Payment | null> {
    const { records } = await this.connection.query({
      sql: FIND_BY_ORDER_ID,
      parameters: {
        order_id: id,
      },
    });

    if (!records.length) {
      logger.debug({
        message: 'Payment not found',
        data: {
          id,
          records,
        },
      });

      return null;
    }

    const [payment] = records;

    return DatabasePaymentMapper.toDomain(payment as PaymentsDbSchema);
  }

  async create(p: Payment): Promise<void> {
    const payment = DatabasePaymentMapper.toDatabase(p);

    const columns = Object.keys(payment)
      .filter(
        (key) =>
          payment[key] !== undefined && payment[key] !== null,
      )
      .map((key) => {
        return key;
      });

    const parameters = columns.map((key) => {
      return `:${key}`;
    });

    try {
      await this.connection.begin();

      await this.connection.query({
        sql: INSERT_PAYMENT(columns.join(), parameters.join()),
        parameters: payment,
      });

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
  async update(payment: Payment): Promise<void> {
    //TODO: Implementar update
  }
}
