import logger from '@cloud-burger/logger';
import Connection from '~/api/postgres/connection';
import ConnectionCache from '~/api/redis/connection-cache';
import { Customer } from '~/domain/customer/entities/customer';
import { CustomerRepository as ICustomerRepository } from '~/domain/customer/repositories/customer';
import { CustomerDbSchema } from './dtos/customer-db-schema';
import { DatabaseCustomerMapper } from './mappers/database-customer';
import { FIND_CUSTOMER_BY_DOCUMENT_NUMBER } from './queries/find-by-document-number';
import { INSERT_CUSTOMER } from './queries/insert';

export class CustomerRepository implements ICustomerRepository {
  constructor(
    private connection: Connection,
    private connectionCache?: ConnectionCache
  ) {}

  async findByDocumentNumber(documentNumber: string): Promise<Customer | null> {
    var result = [];

    var recordsCache = await this.connectionCache.get('customer:document_number:' + documentNumber);
    if (Object.keys(recordsCache).length != 0) {
      result = recordsCache;
    } else {
      const { records } = await this.connection.query({
        sql: FIND_CUSTOMER_BY_DOCUMENT_NUMBER,
        parameters: {
          document_number: documentNumber,
        },
      });

      if (!records.length) {
        logger.debug({
          message: 'Customer not found',
          data: {
            documentNumber,
            records,
          },
        });

        return null;
      }

      await this.connectionCache.set('customer:document_number:' + documentNumber, records);

      result = records;
    }

    const [customer] = result;

    return DatabaseCustomerMapper.toDomain(customer as CustomerDbSchema);
  }

  async create(customer: Customer): Promise<void> {
    const recordsToSave = DatabaseCustomerMapper.toDatabase(customer);

    const columns = Object.keys(recordsToSave)
      .filter(
        (key) =>
          recordsToSave[key] !== undefined && recordsToSave[key] !== null,
      )
      .map((key) => {
        return key;
      });

    const parameters = columns.map((key) => {
      return `:${key}`;
    });

    await this.connection.query({
      sql: INSERT_CUSTOMER(columns.join(), parameters.join()),
      parameters: recordsToSave,
    });
  }
}
