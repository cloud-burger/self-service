import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';
import { CustomerResponse } from '~/driver/customer/controllers/presenter/dtos/customer-response';
import { ProductResponse } from './product-response';

export interface OrderResponse {
  id: string;
  amount: string;
  number: number;
  customer?: CustomerResponse;
  status: OrderStatus;
  products: ProductResponse[];
}
