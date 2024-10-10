import { PgConnection } from './pg-connection';
import { PgPool } from './pg-pool';

jest.mock('pg');
describe('pg pool', () => {
  it('should return instance of pg pool and execute get connection successfully', async () => {
    const pool = await PgPool.getPool();
    const connection = await pool.getConnection();

    expect(pool).toBeInstanceOf(PgPool);
    expect(connection).toBeInstanceOf(PgConnection);
  });

  it('should return singleton instance of pg pool and execute get connection successfully', async () => {
    const pool = await PgPool.getPool();
    const connection = await pool.getConnection();

    expect(pool).toBeInstanceOf(PgPool);
    expect(connection).toBeInstanceOf(PgConnection);
  });
});
