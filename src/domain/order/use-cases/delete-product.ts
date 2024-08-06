import { NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { ProductRepository } from '../repositories/product';

interface Input {
  id: string;
}

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(input: Input): Promise<boolean> {
    const product = await this.productRepository.findById(input.id);

    if (!product) {
      logger.warn({
        message: 'Product not found to delete',
        data: input,
      });

      throw new NotFoundError('Product not found to delete');
    }

    logger.debug({
      message: 'Deleting product',
      data: product,
    });

    return await this.productRepository.deleteById(product.id);
  }
}
