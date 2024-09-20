import { Entity, EntityProps } from '~/domain/core/entities/entity';
import { Order } from '~/domain/order/entities/order';
import { PaymentStatus } from './value-objects/payment-status';

export interface PaymentProps extends EntityProps {
  amount: number;
  order?: Order;
  emv?: string;
  status?: PaymentStatus;
  externalId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Payment extends Entity {
  amount: number;
  status: PaymentStatus;
  order?: Order;
  emv?: string;
  externalId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: PaymentProps) {
    super(input.id);

    input.status = input.status ?? PaymentStatus.WAITING_PAYMENT;
    input.createdAt = input.createdAt ?? new Date();
    input.updatedAt = input.updatedAt ?? new Date();

    Object.assign(this, input);
  }

  setExternalId(externalId: number) {
    this.externalId = externalId;
  }

  setEmv(emv: string) {
    this.emv = emv;
  }

  setOrder(order: Order) {
    this.order = order;
  }
}
