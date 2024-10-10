import logger from '@cloud-burger/logger';
import knex from 'knex';
import { PoolClient } from 'pg';
import Connection, { QueryObject, QueryResult } from '../connection';

export class PgConnection implements Connection {
  private instance: PoolClient;

  constructor(instance: PoolClient) {
    this.instance = instance;
  }

  async query(query: QueryObject): Promise<QueryResult> {
    const { sql, parameters } = query;

    const newQuery = knex({ client: 'pg' })
      .raw(sql, parameters as any)
      .toQuery();

    logger.debug({
      message: 'Query to execute',
      data: {
        sql,
        parameters,
        newQuery,
      },
    });

    const { rows, rowCount } = await this.instance.query(newQuery);

    return new QueryResult(rows, rowCount);
  }

  release(): void {
    this.instance.release();
  }

  async begin(): Promise<void> {
    await this.instance.query('BEGIN');
  }

  async commit(): Promise<void> {
    await this.instance.query('COMMIT');
  }

  async rollback(): Promise<void> {
    await this.instance.query('ROLLBACK');
  }
}
