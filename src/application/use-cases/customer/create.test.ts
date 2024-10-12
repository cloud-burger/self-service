import { mock, MockProxy } from 'jest-mock-extended';
import { makeCustomer } from 'tests/factories/make-customer';
import { CustomerRepository } from '~/domain/customer/repositories/customer';
import { CreateCustomerUseCase } from './create';

describe('create customer use case', () => {
  let customerRepository: MockProxy<CustomerRepository>;
  let createCustomerUseCase: CreateCustomerUseCase;

  beforeAll(() => {
    customerRepository = mock();
    createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
  });

  it('should create customer successfully', async () => {
    customerRepository.findByDocumentNumber.mockResolvedValue(null);
    customerRepository.create.mockResolvedValue();

    const customer = await createCustomerUseCase.execute({
      documentNumber: '53523992060',
      email: 'johndue@gmail.com',
      name: 'John Due',
    });

    expect(customer).toEqual({
      createdAt: expect.any(Date),
      documentNumber: '53523992060',
      email: 'johndue@gmail.com',
      id: expect.any(String),
      name: 'John Due',
      updatedAt: expect.any(Date),
    });
    expect(customerRepository.findByDocumentNumber).toHaveBeenNthCalledWith(
      1,
      '53523992060',
    );
    expect(customerRepository.create).toHaveBeenNthCalledWith(1, {
      createdAt: expect.any(Date),
      documentNumber: '53523992060',
      email: 'johndue@gmail.com',
      id: expect.any(String),
      name: 'John Due',
      updatedAt: expect.any(Date),
    });
  });

  it('should throw conflict error when customer already exists', async () => {
    customerRepository.findByDocumentNumber.mockResolvedValue(makeCustomer());

    await expect(
      createCustomerUseCase.execute({
        documentNumber: '53523992060',
        email: 'johndue@gmail.com',
        name: 'John Due',
      }),
    ).rejects.toThrow('Customer already exists');

    expect(customerRepository.findByDocumentNumber).toHaveBeenNthCalledWith(
      1,
      '53523992060',
    );
    expect(customerRepository.create).not.toHaveBeenCalled();
  });
});
