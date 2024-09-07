import { mock } from 'jest-mock-extended';
import { createRequest, createResponse } from 'node-mocks-http';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { updateProduct } from './update-product';

jest.mock('~/app/postgres/connection');
jest.mock('~/app/postgres/pool');
jest.mock('~/app/postgres/pool-factory');
jest.mock('~/controllers/order/update-product');
jest.mock('~/domain/order/use-cases/update-product');
jest.mock('~/gateways/database/order/product-repository');

describe('update product handler', () => {
  const poolFactoryMock = jest.mocked(PoolFactory);

  it('should call update product controller', async () => {
    const dbClientMock = mock<Pool>();

    poolFactoryMock.getPool.mockResolvedValue(dbClientMock);
    dbClientMock.getConnection.mockResolvedValue(mock<Connection>());

    const req = createRequest();
    const res = createResponse();

    await updateProduct(req, res);
  });
});
