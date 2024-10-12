import { PoolConfig, Pool as PostgresPool } from 'pg';
import { env } from '~/api/env';
import Connection from '../connection';
import Pool from '../pool';
import { PgConnection } from './pg-connection';

export class PgPool implements Pool {
  private static instance: PgPool;

  private constructor(private pool: PostgresPool) {}

  public static async getPool(): Promise<PgPool> {
    if (this.instance) {
      return this.instance;
    }

    const poolConfig: PoolConfig = {
      user: env.DATABASE_USERNAME,
      database: env.DATABASE_NAME,
      password: env.DATABASE_PASSWORD,
      port: +env.DATABASE_PORT,
      host: env.DATABASE_HOST,
      connectionTimeoutMillis: +env.DATABASE_CONNECTION_TIMEOUT,
    };

    const pool = new PostgresPool(poolConfig);

    this.instance = new PgPool(pool);

    return this.instance;
  }

  public async getConnection(): Promise<Connection> {
    const client = await this.pool.connect();

    return new PgConnection(client);
  }
}
