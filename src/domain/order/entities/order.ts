import { Entity, EntityProps } from '~/domain/core/entities/entity';
import { Customer } from '~/domain/customer/entities/customer';
import { Product } from './product';

export interface OrderProps extends EntityProps {
  amount: number;
  products: Product[];
  customer: Customer;
  createdAt: Date;
  updatedAt: Date;
}

export class Order extends Entity {
  amount: number;
  products: Product[];
  customer: Customer;
  createdAt: Date;
  updatedAt: Date;

  constructor(input: OrderProps) {
    super(input.id);
    Object.assign(this, input);
  }
}
