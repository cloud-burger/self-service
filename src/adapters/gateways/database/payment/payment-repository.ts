import logger from '@cloud-burger/logger';
import Connection from '~/app/postgres/connection';
import { PaymentRepository as IPaymentRepository } from '~/domain/payment/repositories/payment';
import { Payment } from '~/domain/payment/entities/payment';
import { FIND_BY_ORDER_ID } from './queries/find-by-order-id';
import { PaymentsDbSchema } from './dtos/payment-db-schema';
import { DatabasePaymentMapper } from './mappers/database-payment';

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

  async create(payment: Payment): Promise<void> {
    //TODO: Implementar create
  }
  async update(payment: Payment): Promise<void> {
    //TODO: Implementar update
  }
}
