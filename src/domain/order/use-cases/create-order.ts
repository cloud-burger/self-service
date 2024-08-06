import { Order } from '../entities/order';
import { OrderStatus } from '../entities/value-objects/enums/order-status';
import { OrderRepository } from '../repositories/order';
import logger from '@cloud-burger/logger';
import { Product } from '../entities/product';
import { ProductRepository } from '~/driven/database/order/postgres/product-repository';

interface Input {
  customer: string;
  products: Partial<Product>[];
}

export class CreateOrderUseCase {
  constructor(private orderRepository: OrderRepository, private productRepository: ProductRepository) {}

  async execute({products, customer}: Input): Promise<Order> {
    const now = new Date();
    const status = OrderStatus.RECEIVED;
    let productsList = [];

    for (const product of products) {
      const dataProduct = await this.productRepository.findById(product.id);

      if (!dataProduct) {
        throw new NotFoundError("Product not found");
      }

      productsList.push(dataProduct);
    }

    const newOrder = new Order({
      amount: 10,
      customer: null,
      status,
      createdAt: now,
      updatedAt: now,
      products: productsList
    });

    logger.debug({
      message: 'Creating order',
      data: newOrder
    });

    await this.orderRepository.create(newOrder);

    return newOrder;
  };
}
