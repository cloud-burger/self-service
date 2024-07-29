export interface OrderDbSchema {
  id: string;
  amount: number;
  customer_id?: string;
  customer?: CustomerDbSchema;
  status: string;
  created_at: string;
  updated_at: string;
  products: ProdcutDbSchema[];
}
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
