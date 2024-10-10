import { ConflictError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Product } from '~/domain/order/entities/product';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';
import { ProductRepository } from '~/domain/order/repositories/product';

interface Input {
  name: string;
  category: ProductCategory;
  description: string;
  amount: number;
  image?: any;
}

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    name,
    category,
    amount,
    description,
    image,
  }: Input): Promise<Product> {
    const product = await this.productRepository.findByCategoryAndName(
      category,
      name,
    );

    if (product) {
      logger.warn({
        message: 'Product already exists',
        data: product,
      });

      throw new ConflictError('Product already exists');
    }

    const newProduct = new Product({
      name,
      category,
      amount,
      description,
      image,
    });

    logger.debug({
      message: 'Creating product',
      data: product,
    });

    await this.productRepository.create(newProduct);

    return newProduct;
  }
}
