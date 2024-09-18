import { Entity, EntityProps } from '~/domain/core/entities/entity';
import { Customer } from '~/domain/customer/entities/customer';
import { Product } from './product';
import { OrderStatus } from './value-objects/enums/order-status';

export interface OrderProps extends EntityProps {
  amount?: number;
  number?: number;
  products?: Product[];
  customer?: Customer;
  status?: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order extends Entity {
  amount: number;
  number?: number;
  products: Product[];
  customer?: Customer;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(input: OrderProps = {}) {
    super(input.id);

    input.status = input.status ?? OrderStatus.WAITING_PAYMENT;
    input.createdAt = input.createdAt ?? new Date();
    input.updatedAt = input.updatedAt ?? new Date();
    input.products = input.products ?? [];
    input.customer = input.customer ?? null;

    Object.assign(this, input);
  }

  addProduct(product: Product) {
    this.products.push(product);
  }

  addCustomer(customer: Customer) {
    this.customer = customer;
  }

  calculateAmount() {
    this.amount = this.products.reduce(
      (total, product) => total + product.amount * product.quantity,
      0,
    );
  }

  setNumber(number: number) {
    this.number = number;
  }
}
