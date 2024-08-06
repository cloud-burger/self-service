import { Product } from '../entities/product';
import { ProductCategory } from '../entities/value-objects/enums/product-category';

export interface ProductRepository {
  create(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  findByCategoryAndName(
    category: ProductCategory,
    name: string,
  ): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  deleteById(id: string): Promise<void>;
  findByCategory(category: string): Promise<Product[]>;
}
