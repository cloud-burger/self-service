import { mock } from 'jest-mock-extended';
import { createRequest, createResponse } from 'node-mocks-http';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { createPayment } from './create';

jest.mock('~/app/postgres/connection');
jest.mock('~/app/postgres/pool');
jest.mock('~/app/postgres/pool-factory');
jest.mock('~/controllers/payment/create');
jest.mock('~/domain/payment/services/payment');
jest.mock('~/gateways/database/order/order-repository');
jest.mock('~/gateways/database/payment/payment-repository');
jest.mock('~/gateways/http/mercado-pago/mercado-pago-service');

describe('create payment handler', () => {
  const poolFactoryMock = jest.mocked(PoolFactory);

  it('should call create payment controller', async () => {
    const dbClientMock = mock<Pool>();

    poolFactoryMock.getPool.mockResolvedValue(dbClientMock);
    dbClientMock.getConnection.mockResolvedValue(mock<Connection>());

    const req = createRequest();
    const res = createResponse();

    await createPayment(req, res);
  });
});
