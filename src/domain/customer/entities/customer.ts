import { Entity, EntityProps } from '~/domain/core/entities/entity';
import { CustomerStatus } from './value-objects/enum/customer-status';

export interface CustomerProps extends EntityProps {
  documentNumber: string;
  name: string;
  email: string;
  status: CustomerStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer extends Entity {
  documentNumber: string;
  name: string;
  email: string;
  status: CustomerStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(input: CustomerProps) {
    super(input.id);
    Object.assign(this, input);
  }
}
