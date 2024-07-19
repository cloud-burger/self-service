import { mock, MockProxy } from 'jest-mock-extended';
import { makeCustomer } from 'tests/factories/make-customer';
import { CustomerRepository } from '../repositories/customer';
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

  it('should return existent customer', async () => {
    customerRepository.findByDocumentNumber.mockResolvedValue(makeCustomer());

    const customer = await createCustomerUseCase.execute({
      documentNumber: '53523992060',
      email: 'johndue@gmail.com',
      name: 'John Due',
    });

    expect(customer).toEqual({
      createdAt: new Date('2024-07-12T22:18:26.351Z'),
      documentNumber: '53523992060',
      email: 'johndue@gmail.com',
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      name: 'John Due',
      updatedAt: new Date('2024-07-12T22:18:26.351Z'),
    });
    expect(customerRepository.findByDocumentNumber).toHaveBeenNthCalledWith(
      1,
      '53523992060',
    );
    expect(customerRepository.create).not.toHaveBeenCalled();
  });
});
