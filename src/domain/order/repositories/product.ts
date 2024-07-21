import { Product } from '../entities/product';
import { ProductCategory } from '../entities/value-objects/enums/product-category';

export interface ProductRepository {
  create(product: Product): Promise<void>;
  findByCategoryAndName(
    category: ProductCategory,
    name: string,
  ): Promise<Product | null>;
}
