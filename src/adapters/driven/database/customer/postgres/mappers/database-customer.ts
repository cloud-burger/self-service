import { Customer } from '~/domain/customer/entities/customer';
import { CustomerDbSchema } from '../dtos/customer-db-schema';

export class DatabaseCustomerMapper {
  static toDomain(customerDbSchema: CustomerDbSchema): Customer {
    return new Customer({
      id: customerDbSchema.id,
      name: customerDbSchema.name,
      documentNumber: customerDbSchema.document_number,
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
      email: customer.email,
      created_at: customer.createdAt.toISOString(),
      updated_at: customer.updatedAt.toISOString(),
    };
  }
}
