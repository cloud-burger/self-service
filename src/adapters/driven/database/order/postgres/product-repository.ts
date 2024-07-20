import logger from '@cloud-burger/logger';
import Connection from '~/app/postgres/connection';
import { Product } from '~/domain/order/entities/product';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';
import { ProductRepository as IProductRepository } from '~/domain/order/repositories/product';
import { ProductDbSchema } from './dtos/product-db-schema';
import { DatabaseProductMapper } from './mappers/database-product';
import { FIND_PRODUCT_BY_CATEGORY_AND_NAME } from './queries/find-by-category-and-name';
import { INSERT_PRODUCT } from './queries/insert-product';

export class ProductRepository implements IProductRepository {
  constructor(private connection: Connection) {}

  async create(product: Product): Promise<void> {
    const recordsToSave = DatabaseProductMapper.toDatabase(product);

    const columns = Object.keys(recordsToSave)
      .filter(
        (key) =>
          recordsToSave[key] !== undefined && recordsToSave[key] !== null,
      )
      .map((key) => {
        return key;
      });

    const parameters = columns.map((key) => {
      return `:${key}`;
    });

    await this.connection.query({
      sql: INSERT_PRODUCT(columns.join(), parameters.join()),
      parameters: recordsToSave,
    });
  }

  async findByCategoryAndName(
    category: ProductCategory,
    name: string,
  ): Promise<Product | null> {
    const { records } = await this.connection.query({
      sql: FIND_PRODUCT_BY_CATEGORY_AND_NAME,
      parameters: {
        category,
        name: name.toLowerCase(),
      },
    });

    if (!records.length) {
      logger.debug({
        message: 'Product does not exists',
        data: {
          category,
          name,
          records,
        },
      });

      return null;
    }

    const [product] = records;

    return DatabaseProductMapper.toDomain(product as ProductDbSchema);
  }
}
