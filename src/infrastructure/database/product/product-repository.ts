import logger from '@cloud-burger/logger';
import Connection from '~/app/postgres/connection';
import { Product } from '~/domain/order/entities/product';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';
import { ProductRepository as IProductRepository } from '~/domain/order/repositories/product';
import { ProductDbSchema } from './dtos/product-db-schema';
import { DatabaseProductMapper } from './mappers/database-product';
import { DELETE_PRODUCT_BY_ID } from './queries/delete-product-by-id';
import { FIND_PRODUCT_BY_CATEGORY } from './queries/find-product-by-category';
import { FIND_PRODUCT_BY_CATEGORY_AND_NAME } from './queries/find-product-by-category-and-name';
import { FIND_PRODUCT_BY_ID } from './queries/find-product-by-id';
import { INSERT_PRODUCT } from './queries/insert-product';
import { UPDATE_PRODUCT } from './queries/update-product';

export class ProductRepository implements IProductRepository {
  constructor(private connection: Connection) {}

  async create(product: Product): Promise<void> {
    const recordToSave = DatabaseProductMapper.toDatabase(product);

    const columns = Object.keys(recordToSave)
      .filter(
        (key) => recordToSave[key] !== undefined && recordToSave[key] !== null,
      )
      .map((key) => {
        return key;
      });

    const parameters = columns.map((key) => {
      return `:${key}`;
    });

    await this.connection.query({
      sql: INSERT_PRODUCT(columns.join(), parameters.join()),
      parameters: recordToSave,
    });
  }

  async update(product: Product): Promise<void> {
    const recordToSave = DatabaseProductMapper.toDatabase(product);

    await this.connection.query({
      sql: UPDATE_PRODUCT,
      parameters: recordToSave,
    });
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    const { records } = await this.connection.query({
      sql: FIND_PRODUCT_BY_CATEGORY,
      parameters: {
        category,
      },
    });

    return records.map((record) =>
      DatabaseProductMapper.toDomain(record as ProductDbSchema),
    );
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

  async findById(id: string): Promise<Product | null> {
    const { records } = await this.connection.query({
      sql: FIND_PRODUCT_BY_ID,
      parameters: {
        id,
      },
    });

    if (!records.length) {
      logger.debug({
        message: 'Product does not exists',
        data: {
          id,
          records,
        },
      });

      return null;
    }

    const [product] = records;

    return DatabaseProductMapper.toDomain(product as ProductDbSchema);
  }

  async deleteById(id: string): Promise<void> {
    await this.connection.query({
      sql: DELETE_PRODUCT_BY_ID,
      parameters: {
        id,
      },
    });
  }
}
