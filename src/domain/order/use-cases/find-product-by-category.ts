import { NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Product } from '../entities/product';
import { ProductRepository } from '../repositories/product';
import { ProductCategory } from '../entities/value-objects/enums/product-category';

interface Input {
    category: string;
}

export class FindProductByCategoryUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute({ category }: Input): Promise<Product[]> {
        const product = await this.productRepository.findByCategory(category);

        if (!product) {
            logger.warn({
                message: 'Product not found',
                data: {
                    category
                }
            });

            throw new NotFoundError('Product not found');
        }

        logger.debug({
            message: 'Product found',
            data: product
        });

        return product;
    }
}