import logger from '@cloud-burger/logger';
import { Customer } from '../entities/customer';
import { CustomerStatus } from '../entities/value-objects/enum/customer-status';
import { CustomerRepository } from '../repositories/customer';

interface Input {
  documentNumber: string;
  name: string;
  email: string;
}

export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({ documentNumber, email, name }: Input): Promise<Customer> {
    const customer =
      await this.customerRepository.findByDocumentNumber(documentNumber);

    if (customer) {
      logger.debug({
        message: 'Customer already exists',
        data: customer,
      });

      return customer;
    }

    const now = new Date();

    const newCustomer = new Customer({
      documentNumber,
      email,
      name,
      status: CustomerStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });

    logger.debug({
      message: 'Creating customer',
      data: customer,
    });

    await this.customerRepository.create(newCustomer);

    return newCustomer;
  }
}
