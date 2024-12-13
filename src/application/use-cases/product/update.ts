import { NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Product } from '~/domain/order/entities/product';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';
import { ProductRepository } from '~/domain/order/repositories/product';

interface Input {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  amount: number;
  image?: any;
}

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(input: Input): Promise<Product> {
    const product = await this.productRepository.findById(input.id);

    if (!product) {
      logger.warn({
        message: 'Product not found',
        data: input,
      });

      throw new NotFoundError('Product not found');
    }

    const newProduct = new Product({
      ...product,
      ...input,
      updatedAt: new Date(),
    });

    logger.debug({
      message: 'Updating product',
      data: product,
    });

    await this.productRepository.update(newProduct, product.category);

    return newProduct;
  }
}
