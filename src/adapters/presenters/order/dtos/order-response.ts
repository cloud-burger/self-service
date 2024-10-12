import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';
import { CustomerResponse } from '~/presenters/customer/dtos/customer-response';
import { ProductResponse } from '../../product/dtos/product-response';

export interface OrderResponse {
  id: string;
  amount: string;
  number: number;
  customer?: CustomerResponse;
  status: OrderStatus;
  products: ProductResponse[];
}
