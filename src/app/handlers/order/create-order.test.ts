import { mock } from 'jest-mock-extended';
import { createRequest, createResponse } from 'node-mocks-http';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { createOrder } from './create-order';

jest.mock('~/app/postgres/connection');
jest.mock('~/app/postgres/pool');
jest.mock('~/app/postgres/pool-factory');
jest.mock('~/domain/customer/use-cases/find-by-document-number');
jest.mock('~/domain/order/use-cases/create-order');
jest.mock('~/driven/database/customer/postgres/customer-repository');
jest.mock('~/driven/database/order/postgres/order-repository');
jest.mock('~/driven/database/order/postgres/product-repository');
jest.mock('~/driver/order/controllers/create-order');

describe('create order handler', () => {
  const poolFactoryMock = jest.mocked(PoolFactory);

  it('should call create order controller', async () => {
    const dbClientMock = mock<Pool>();

    poolFactoryMock.getPool.mockResolvedValue(dbClientMock);
    dbClientMock.getConnection.mockResolvedValue(mock<Connection>());

    const req = createRequest();
    const res = createResponse();

    await createOrder(req, res);
  });
});
