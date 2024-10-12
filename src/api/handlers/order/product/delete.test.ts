import { mock } from 'jest-mock-extended';
import { createRequest, createResponse } from 'node-mocks-http';
import Connection from '~/api/postgres/connection';
import Pool from '~/api/postgres/pool';
import { PoolFactory } from '~/api/postgres/pool-factory';
import { deleteProduct } from './delete';

jest.mock('~/api/postgres/connection');
jest.mock('~/api/postgres/pool');
jest.mock('~/api/postgres/pool-factory');
jest.mock('~/controllers/product/delete');

describe('delete product handler', () => {
  const poolFactoryMock = jest.mocked(PoolFactory);

  it('should call delete product controller', async () => {
    const dbClientMock = mock<Pool>();

    poolFactoryMock.getPool.mockResolvedValue(dbClientMock);
    dbClientMock.getConnection.mockResolvedValue(mock<Connection>());

    const req = createRequest();
    const res = createResponse();

    await deleteProduct(req, res);
  });
});
