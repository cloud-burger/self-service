import { Entity, EntityProps } from '~/domain/core/entities/entity';

export interface CustomerProps extends EntityProps {
  documentNumber: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Customer extends Entity {
  documentNumber: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(input: CustomerProps) {
    super(input.id);

    input.createdAt = input.createdAt ?? new Date();
    input.updatedAt = input.updatedAt ?? new Date();

    Object.assign(this, input);
  }
}
