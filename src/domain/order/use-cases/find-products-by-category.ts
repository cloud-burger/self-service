import { Product } from '../entities/product';
import { ProductCategory } from '../entities/value-objects/enums/product-category';
import { ProductRepository } from '../repositories/product';

interface Input {
  category: ProductCategory;
}

export class FindProductsByCategoryUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({ category }: Input): Promise<Product[]> {
    return await this.productRepository.findByCategory(category);
  }
}
