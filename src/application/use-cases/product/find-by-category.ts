import { Product } from '~/domain/order/entities/product';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';
import { ProductRepository } from '~/domain/order/repositories/product';

interface Input {
  category: ProductCategory;
}

export class FindProductsByCategoryUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({ category }: Input): Promise<Product[]> {
    return await this.productRepository.findByCategory(category);
  }
}
