import { NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { ProductRepository } from '../../repositories/product';

interface Input {
  id: string;
}

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({ id }: Input): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      logger.warn({
        message: 'Product not found',
        data: id,
      });

      throw new NotFoundError('Product not found');
    }

    logger.debug({
      message: 'Deleting product',
      data: product,
    });

    await this.productRepository.deleteById(product.id);
  }
}
