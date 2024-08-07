import { NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Customer } from '~/domain/customer/entities/customer';
import { FindCustomerByDocumentNumberUseCase } from '~/domain/customer/use-cases/find-by-document-number';
import { Order } from '../entities/order';
import { Product } from '../entities/product';
import { OrderStatus } from '../entities/value-objects/enums/order-status';
import { OrderRepository } from '../repositories/order';
import { ProductRepository } from '../repositories/product';

interface Input {
  customerTaxId?: string;
  products: Partial<Product>[];
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase,
  ) {}

  async execute({ products, customerTaxId }: Input): Promise<Order> {
    const now = new Date();
    let dataCustomer: Customer = null;

    if (customerTaxId) {
      dataCustomer = await this.findCustomerByDocumentNumberUseCase.execute({
        documentNumber: customerTaxId,
      });
    }

    for (const product of products) {
      const dataProduct = await this.productRepository.findById(product.id);

      if (!dataProduct) {
        logger.warn({
          message: 'Product not found',
          data: product,
        });
        throw new NotFoundError('Product not found');
      }
    }

    const order = new Order({
      amount: products.reduce(
        (total, product) => total + product.amount * product.quantity,
        0,
      ),
      customer: dataCustomer,
      status: OrderStatus.RECEIVED,
      createdAt: now,
      updatedAt: now,
      products: products,
    });

    logger.debug({
      message: 'Creating order',
      data: order,
    });

    await this.orderRepository.create(order);

    return order;
  }
}
