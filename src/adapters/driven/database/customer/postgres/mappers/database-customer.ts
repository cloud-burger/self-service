import { Customer } from '~/domain/customer/entities/customer';
import { CustomerStatus } from '~/domain/customer/entities/value-objects/enum/customer-status';
import { CustomerDbSchema } from '../dtos/customer-db-schema';

export class DatabaseCustomerMapper {
  static toDomain(customerDbSchema: CustomerDbSchema): Customer {
    return new Customer({
      id: customerDbSchema.id,
      name: customerDbSchema.name,
      documentNumber: customerDbSchema.document_number,
      status: customerDbSchema.status as CustomerStatus,
      email: customerDbSchema.email,
      createdAt: new Date(customerDbSchema.created_at),
      updatedAt: new Date(customerDbSchema.updated_at),
    });
  }

  static toDatabase(customer: Customer): CustomerDbSchema {
    return {
      id: customer.id,
      name: customer.name,
      document_number: customer.documentNumber,
      status: customer.status,
      email: customer.email,
      created_at: customer.createdAt.toISOString(),
      updated_at: customer.updatedAt.toISOString(),
    };
  }
}
