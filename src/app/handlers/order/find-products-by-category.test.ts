import { mock } from 'jest-mock-extended';
import { createRequest, createResponse } from 'node-mocks-http';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { findProductsByCategory } from './find-products-by-category';

jest.mock('~/app/postgres/connection');
jest.mock('~/app/postgres/pool');
jest.mock('~/app/postgres/pool-factory');
jest.mock('~/domain/order/use-cases/find-products-by-category');
jest.mock('~/driven/database/order/postgres/product-repository');
jest.mock('~/driver/order/controllers/find-products-by-category');

describe('find product by category handler', () => {
  const poolFactoryMock = jest.mocked(PoolFactory);

  it('should call find product by category controller', async () => {
    const dbClientMock = mock<Pool>();

    poolFactoryMock.getPool.mockResolvedValue(dbClientMock);
    dbClientMock.getConnection.mockResolvedValue(mock<Connection>());

    const req = createRequest();
    const res = createResponse();

    await findProductsByCategory(req, res);
  });
});
