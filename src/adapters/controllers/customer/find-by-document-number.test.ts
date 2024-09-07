import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeCustomer } from 'tests/factories/make-customer';
import { FindCustomerByDocumentNumberUseCase } from '~/domain/customer/use-cases/find-by-document-number';
import { FindCustomerByDocumentNumberController } from './find-by-document-number';

describe('find customer by document number controller', () => {
  let findCustomerByDocumentNumberUseCase: MockProxy<FindCustomerByDocumentNumberUseCase>;
  let findCustomerByDocumentNumberController: FindCustomerByDocumentNumberController;

  beforeAll(() => {
    findCustomerByDocumentNumberUseCase = mock();
    findCustomerByDocumentNumberController =
      new FindCustomerByDocumentNumberController(
        findCustomerByDocumentNumberUseCase,
      );
  });

  it('should be able to find customer by document number', async () => {
    findCustomerByDocumentNumberUseCase.execute.mockResolvedValue(
      makeCustomer(),
    );

    const response = await findCustomerByDocumentNumberController.handler({
      pathParameters: {
        documentNumber: '53523992060',
      },
    } as unknown as Request);

    expect(response).toEqual({
      body: {
        documentNumber: '53523992060',
        email: 'johndue@gmail.com',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        name: 'John Due',
      },
      statusCode: 200,
    });
    expect(findCustomerByDocumentNumberUseCase.execute).toHaveBeenNthCalledWith(
      1,
      {
        documentNumber: '53523992060',
      },
    );
  });
});
