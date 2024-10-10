import { mock, MockProxy } from 'jest-mock-extended';
import { PoolClient } from 'pg';
import { PgConnection } from './pg-connection';

describe('pg connection', () => {
  let poolClientMock: MockProxy<PoolClient>;
  let pgConnection: PgConnection;

  beforeAll(() => {
    poolClientMock = mock();
    pgConnection = new PgConnection(poolClientMock);
  });

  it('should execute query successfully', async () => {
    poolClientMock.query.mockResolvedValue({
      rowCount: 1,
      rows: [
        {
          amount: 10,
        },
      ],
    } as never);

    const result = await pgConnection.query({
      sql: 'SELECT * FROM payments',
    });

    expect(result).toEqual({
      numberOfRecordsUpdated: 1,
      records: [{ amount: 10 }],
    });
    expect(poolClientMock.query).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM payments',
    );
  });

  it('should execute release', async () => {
    await pgConnection.release();

    expect(poolClientMock.release).toHaveBeenCalled();
  });

  it('should run begin', async () => {
    poolClientMock.query.mockResolvedValue({
      rowCount: 1,
      rows: [
        {
          amount: 10,
        },
      ],
    } as never);

    await pgConnection.begin();
    expect(poolClientMock.query).toHaveBeenNthCalledWith(1, 'BEGIN');
  });

  it('should run commit', async () => {
    poolClientMock.query.mockResolvedValue({
      rowCount: 1,
      rows: [
        {
          amount: 10,
        },
      ],
    } as never);

    await pgConnection.commit();
    expect(poolClientMock.query).toHaveBeenNthCalledWith(1, 'COMMIT');
  });

  it('should run rollback', async () => {
    poolClientMock.query.mockResolvedValue({
      rowCount: 1,
      rows: [
        {
          amount: 10,
        },
      ],
    } as never);

    await pgConnection.rollback();
    expect(poolClientMock.query).toHaveBeenNthCalledWith(1, 'ROLLBACK');
  });
});
