import { PgPool } from './pg/pg-pool';
import { PoolFactory } from './pool-factory';

jest.mock('./pg/pg-pool');
describe('pool factory', () => {
  const pgPoolMock = jest.mocked(PgPool);

  it('should return pg pool', async () => {
    const poolMock = {} as PgPool;
    pgPoolMock.getPool.mockResolvedValue(poolMock);

    const pool = await PoolFactory.getPool();

    expect(pool).toEqual(poolMock);
  });
});
