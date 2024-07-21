import { Product } from '../entities/product';

export interface ProductRepository {
  create(Product: Product): Promise<void>;
}
