import { getFormattedCurrency } from '~/controllers/helpers/currency';
import { removeNullValues } from '~/controllers/helpers/remove-null-values';
import { Product } from '~/domain/order/entities/product';
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
