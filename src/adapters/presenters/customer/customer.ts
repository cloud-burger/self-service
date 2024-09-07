import { Customer } from '~/domain/customer/entities/customer';
import { CustomerResponse } from './dtos/customer-response';

export class CustomerPresenter {
  static toHttp(customer: Customer): CustomerResponse {
    return {
      id: customer.id,
      name: customer.name,
      documentNumber: customer.documentNumber,
      email: customer.email,
    };
  }
}
