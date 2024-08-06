import { mock } from 'jest-mock-extended';
import { createRequest, createResponse } from 'node-mocks-http';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { listOrders } from './list-orders';

jest.mock('~/app/postgres/connection');
jest.mock('~/app/postgres/pool');
jest.mock('~/app/postgres/pool-factory');
jest.mock('~/domain/order/use-cases/list-orders');
jest.mock('~/driven/database/order/postgres/order-repository');
jest.mock('~/driver/order/controllers/list-orders');

describe('list orders handler', () => {
  const poolFactoryMock = jest.mocked(PoolFactory);

  it('should call list orders controller', async () => {
    const dbClientMock = mock<Pool>();

    poolFactoryMock.getPool.mockResolvedValue(dbClientMock);
    dbClientMock.getConnection.mockResolvedValue(mock<Connection>());

    const req = createRequest();
    const res = createResponse();

    await listOrders(req, res);
  });
});