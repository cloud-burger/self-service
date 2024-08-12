import { Order } from '~/domain/order/entities/order';
import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';
import { makeCustomer } from './make-customer';
import { makeProduct } from './make-product';

export const makeOrder = (override: Partial<Order> = {}): Order =>
  new Order({
    id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    amount: 20.99,
    number: 123,
    customer: makeCustomer(),
    products: [makeProduct({ quantity: 1, notes: 'Sem bacon' })],
    status: OrderStatus.RECEIVED,
    createdAt: new Date('2024-07-12T22:18:26.351Z'),
    updatedAt: new Date('2024-07-12T22:18:26.351Z'),
    ...override,
  });
