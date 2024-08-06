import { mock } from 'jest-mock-extended';
import { createRequest, createResponse } from 'node-mocks-http';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { deleteProduct } from './delete-product';

jest.mock('~/app/postgres/connection');
jest.mock('~/app/postgres/pool');
jest.mock('~/app/postgres/pool-factory');
jest.mock('~/domain/order/use-cases/delete-product');
jest.mock('~/driven/database/order/postgres/product-repository');
jest.mock('~/driver/order/controllers/delete-product');

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
