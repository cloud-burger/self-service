import { PgPool } from './pg/pg-pool';
import Pool from './pool';

export class PoolFactory {
  public static async getPool(): Promise<Pool> {
    return PgPool.getPool();
  }
}
