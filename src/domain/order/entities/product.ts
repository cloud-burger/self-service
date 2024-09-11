import { Entity, EntityProps } from '~/domain/core/entities/entity';
import { ProductCategory } from './value-objects/enums/product-category';

export interface ProductProps extends EntityProps {
  name: string;
  category: ProductCategory;
  description: string;
  amount: number;
  image?: any;
  quantity?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product extends Entity {
  name: string;
  category: ProductCategory;
  description: string;
  amount: number;
  image?: any;
  quantity?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(input: ProductProps) {
    super(input.id);

    input.createdAt = input.createdAt ?? new Date();
    input.updatedAt = input.updatedAt ?? new Date();

    Object.assign(this, input);
  }

  setNotes(notes: string) {
    this.notes = notes;
  }

  setQuantity(quantity: number) {
    this.quantity = quantity;
  }
}
