import { mock } from 'jest-mock-extended';
import { createRequest, createResponse } from 'node-mocks-http';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { findCustomerByDocumentNumber } from './find-by-document-number';

jest.mock('~/app/postgres/connection');
jest.mock('~/app/postgres/pool');
jest.mock('~/app/postgres/pool-factory');
jest.mock('~/controllers/customer/find-by-document-number');
jest.mock('~/domain/customer/use-cases/find-by-document-number');
jest.mock('~/gateways/database/customer/customer-repository');

describe('find customer by document number handler', () => {
  const poolFactoryMock = jest.mocked(PoolFactory);

  it('should call find customer by document number controller', async () => {
    const dbClientMock = mock<Pool>();

    poolFactoryMock.getPool.mockResolvedValue(dbClientMock);
    dbClientMock.getConnection.mockResolvedValue(mock<Connection>());

    const req = createRequest();
    const res = createResponse();

    await findCustomerByDocumentNumber(req, res);
  });
});
