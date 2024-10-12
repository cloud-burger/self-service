import { mock, MockProxy } from 'jest-mock-extended';
import { makeCustomer } from 'tests/factories/make-customer';
import { CustomerRepository } from '~/domain/customer/repositories/customer';
import { FindCustomerByDocumentNumberUseCase } from './find-by-document-number';

describe('find customer by document number use case', () => {
  let customerRepository: MockProxy<CustomerRepository>;
  let findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase;

  beforeAll(() => {
    customerRepository = mock();
    findCustomerByDocumentNumberUseCase =
      new FindCustomerByDocumentNumberUseCase(customerRepository);
  });

  it('should throw not found error when customer does not exists', async () => {
    customerRepository.findByDocumentNumber.mockResolvedValue(null);

    await expect(
      findCustomerByDocumentNumberUseCase.execute({ documentNumber: '1234' }),
    ).rejects.toThrow('Customer not found');

    expect(customerRepository.findByDocumentNumber).toHaveBeenNthCalledWith(
      1,
      '1234',
    );
  });

  it('should find customer by document number successfully', async () => {
    customerRepository.findByDocumentNumber.mockResolvedValue(makeCustomer());

    const customer = await findCustomerByDocumentNumberUseCase.execute({
      documentNumber: '53523992060',
    });

    expect(customer).toEqual({
      createdAt: expect.any(Date),
      documentNumber: '53523992060',
      email: 'johndue@gmail.com',
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      name: 'John Due',
      updatedAt: expect.any(Date),
    });
    expect(customerRepository.findByDocumentNumber).toHaveBeenNthCalledWith(
      1,
      '53523992060',
    );
  });
});
