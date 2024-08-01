import { CustomerDbSchema } from '../../../customer/postgres/dtos/customer-db-schema';
import { ProductDbSchema } from './product-db-schema';

export interface OrdersDbSchema {
  id: string;
  amount: number;
  customer_id?: string;
  customer?: CustomerDbSchema;
  status: string;
  created_at: string;
  updated_at: string;
  products: ProductDbSchema[];
}
