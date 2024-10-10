import { mock } from 'jest-mock-extended';
import { createRequest, createResponse } from 'node-mocks-http';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { getPaymentStatusByOrderId } from './get-status-by-order';

jest.mock('~/app/postgres/connection');
jest.mock('~/app/postgres/pool');
jest.mock('~/app/postgres/pool-factory');
jest.mock('~/controllers/payment/get-status-by-order');
jest.mock('~/gateways/database/payment/payment-repository');

describe('get payment status by order id handler', () => {
  const poolFactoryMock = jest.mocked(PoolFactory);

  it('should call get payment status by order id controller', async () => {
    const dbClientMock = mock<Pool>();

    poolFactoryMock.getPool.mockResolvedValue(dbClientMock);
    dbClientMock.getConnection.mockResolvedValue(mock<Connection>());

    const req = createRequest();
    const res = createResponse();

    await getPaymentStatusByOrderId(req, res);
  });
});
