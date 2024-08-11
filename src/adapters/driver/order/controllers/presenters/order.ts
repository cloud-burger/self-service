import { Order } from '~/domain/order/entities/order';
import { CustomerPresenter } from '~/driver/customer/controllers/presenter/customer';
import { getFormattedCurrency } from '~/driver/helpers/currency';
import { removeNullValues } from '~/driver/helpers/remove-null-values';
import { OrderResponse } from './dtos/order-response';
import { ProductPresenter } from './product';

export class OrderPresenter {
  static toHttp(order: Order): OrderResponse {
    return removeNullValues({
      id: order.id,
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
