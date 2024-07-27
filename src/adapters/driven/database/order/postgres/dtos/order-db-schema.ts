import { Customer } from '~/domain/customer/entities/customer';
import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';

export interface OrderDbSchema {
  id: string;
  amount: number;
  customer: Customer;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  products: [];
}
