import logger from '@cloud-burger/logger';
import Connection from '~/api/postgres/connection';
import { Payment } from '~/domain/payment/entities/payment';
import { PaymentRepository as IPaymentRepository } from '~/domain/payment/repositories/payment';
import { PaymentsDbSchema } from './dtos/payment-db-schema';
import { DatabasePaymentMapper } from './mappers/database-payment';
import { FIND_BY_ID } from './queries/find-by-id';
import { FIND_BY_ORDER_ID } from './queries/find-by-order-id';
import { INSERT_PAYMENT } from './queries/insert';
import { UPDATE_PAYMENT } from './queries/update';

export class PaymentRepository implements IPaymentRepository {
  constructor(private connection: Connection) {}

  async findById(id: string): Promise<Payment | null> {
    const { records } = await this.connection.query({
      sql: FIND_BY_ID,
      parameters: {
        id: id,
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

  async create(payment: Payment): Promise<void> {
    const recordToSave = DatabasePaymentMapper.toDatabase(payment);

    const columns = Object.keys(recordToSave)
      .filter(
        (key) => recordToSave[key] !== undefined && recordToSave[key] !== null,
      )
      .map((key) => {
        return key;
      });

    const parameters = columns.map((key) => {
      return `:${key}`;
    });

    await this.connection.query({
      sql: INSERT_PAYMENT(columns.join(), parameters.join()),
      parameters: recordToSave,
    });
  }

  async update(payment: Payment): Promise<void> {
    await this.connection.query({
      sql: UPDATE_PAYMENT,
      parameters: {
        id: payment.id,
        external_id: +payment.externalId,
        status: payment.status,
        updated_at: new Date().toISOString(),
      },
    });
  }
}
