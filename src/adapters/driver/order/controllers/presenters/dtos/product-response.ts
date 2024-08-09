import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';

export interface ProductResponse {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  amount: number;
  image?: any;
  notes?: string;
  quantity?: number;
}
