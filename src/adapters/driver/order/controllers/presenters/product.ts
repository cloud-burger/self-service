import { Product } from '~/domain/order/entities/product';
import { getFormattedCurrency } from '~/driver/helpers/currency';
import { removeNullValues } from '~/driver/helpers/remove-null-values';
import { ProductResponse } from './dtos/product-response';

export class ProductPresenter {
  static toHttp(product: Product): ProductResponse {
    return removeNullValues({
      id: product.id,
      amount: getFormattedCurrency(product.amount),
      category: product.category,
      description: product.description,
      name: product.name,
      image: product.image,
      notes: product.notes,
      quantity: product.quantity,
    });
  }
}
