import { Product } from '~/domain/order/entities/product';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';
import { ProductDbSchema } from '../dtos/product-db-schema';

export class DatabaseProductMapper {
  static toDomain(productDbSchema: ProductDbSchema): Product {
    return new Product({
      id: productDbSchema.id,
      amount: +productDbSchema.amount,
      category: productDbSchema.category as ProductCategory,
      description: productDbSchema.description,
      name: productDbSchema.name,
      image: productDbSchema.image,
      createdAt: new Date(productDbSchema.created_at),
      updatedAt: new Date(productDbSchema.updated_at),
    });
  }

  static toDatabase(product: Product): ProductDbSchema {
    return {
      id: product.id,
      amount: product.amount,
      category: product.category,
      description: product.description,
      name: product.name,
      image: product.image,
      created_at: product.createdAt.toISOString(),
      updated_at: product.updatedAt.toISOString(),
    };
  }
}
