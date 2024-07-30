import { CustomerDbSchema } from '../../../customer/postgres/dtos/customer-db-schema';
import { ProductDbSchema } from './product-db-schema';

export interface OrderDbSchema {
  id: string;
  amount: number;
  customer_id?: string;
  customer?: CustomerDbSchema;
  status: string;
  created_at: Date;
  updated_at: Date;
  products: ProductDbSchema[];
}