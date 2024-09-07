import { mock } from 'jest-mock-extended';
import { createRequest, createResponse } from 'node-mocks-http';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { createOrder } from './create-order';

jest.mock('~/app/postgres/connection');
jest.mock('~/app/postgres/pool');
jest.mock('~/app/postgres/pool-factory');
jest.mock('~/controllers/order/create-order');
jest.mock('~/domain/customer/use-cases/find-by-document-number');
jest.mock('~/domain/order/use-cases/create-order');
jest.mock('~/gateways/database/customer/customer-repository');
jest.mock('~/gateways/database/order/order-repository');
jest.mock('~/gateways/database/order/product-repository');

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
