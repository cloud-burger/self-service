import { NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { FindCustomerByDocumentNumberUseCase } from '~/domain/customer/use-cases/find-by-document-number';
import { Order } from '../entities/order';
import { OrderRepository } from '../repositories/order';
import { ProductRepository } from '../repositories/product';

interface Input {
  customerTaxId?: string;
  products: Partial<ProductInput>[];
}

interface ProductInput {
  id: string;
  quantity: number;
  notes?: string;
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase,
  ) {}

  async execute({ products, customerTaxId }: Input): Promise<Order> {
    const order = new Order();
    if (customerTaxId) {
      const customer = await this.findCustomerByDocumentNumberUseCase.execute({
        documentNumber: customerTaxId,
      });

      order.addCustomer(customer);
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

      dataProduct.setQuantity(product.quantity);
      dataProduct.setNotes(product.notes);

      order.addProduct(dataProduct);
    }

    order.calculateAmount();

    logger.debug({
      message: 'Creating order',
      data: order,
    });

    const orderNumber = await this.orderRepository.create(order);

    order.setNumber(orderNumber);

    return order;
  }
}
