import { getFormattedCurrency } from '~/controllers/helpers/currency';
import { removeNullValues } from '~/controllers/helpers/remove-null-values';
import { Order } from '~/domain/order/entities/order';
import { CustomerPresenter } from '../customer/customer';
import { OrderResponse } from './dtos/order-response';
import { ProductPresenter } from './product';

export class OrderPresenter {
  static toHttp(order: Order): OrderResponse {
    return removeNullValues({
      id: order.id,
      number: order.number,
      amount: getFormattedCurrency(order.amount),
      status: order.status,
      products: order.products.map((product) =>
        ProductPresenter.toHttp(product),
      ),
      customer: order.customer
        ? CustomerPresenter.toHttp(order.customer)
        : null,
    });
  }
}
