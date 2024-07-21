import { Product } from '~/domain/order/entities/product';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';

export const makeProduct = (override: Partial<Product> = {}): Product =>
  new Product({
    id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    amount: 20.99,
    category: ProductCategory.BURGER,
    description:
      'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
    name: 'Bacon Burger',
    image: null,
    createdAt: new Date('2024-07-12T22:18:26.351Z'),
    updatedAt: new Date('2024-07-12T22:18:26.351Z'),
    ...override,
  });
