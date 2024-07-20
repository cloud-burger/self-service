import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeCustomer } from 'tests/factories/make-customer';
import { CreateCustomerUseCase } from '~/domain/customer/use-cases/create';
import { CreateCustomerController } from './create';

describe('create customer controller', () => {
  let createCustomerUseCase: MockProxy<CreateCustomerUseCase>;
  let createCustomerController: CreateCustomerController;

  beforeAll(() => {
    createCustomerUseCase = mock();
    createCustomerController = new CreateCustomerController(
      createCustomerUseCase,
    );
  });

  it('should throw validation error when input is invalid', async () => {
    try {
      await createCustomerController.handler({
        body: {
          documentNumber: '12345',
          name: null,
          email: 'test@email.com',
        },
      } as unknown as Request);
    } catch (error) {
      expect(error.toObject()).toEqual({
        invalidParams: [
          {
            name: 'documentNumber',
            reason:
              'Customer document number failed custom validation because Invalid document number',
            value: '12345',
          },
          {
            name: 'name',
            reason: 'Customer name must be a string',
            value: null,
          },
        ],
        reason: 'Invalid request data',
      });
    }

    expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
  });

  it('should create customer successfully', async () => {
    createCustomerUseCase.execute.mockResolvedValue(makeCustomer());

    const response = await createCustomerController.handler({
      body: {
        documentNumber: '53523992060',
        name: 'John Due',
        email: 'johndue@gmail.com',
      },
    } as unknown as Request);

    expect(response).toEqual({
      body: {
        createdAt: new Date('2024-07-12T22:18:26.351Z'),
        documentNumber: '53523992060',
        email: 'johndue@gmail.com',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        name: 'John Due',
        updatedAt: new Date('2024-07-12T22:18:26.351Z'),
      },
      statusCode: 201,
    });
    expect(createCustomerUseCase.execute).toHaveBeenNthCalledWith(1, {
      documentNumber: '53523992060',
      email: 'johndue@gmail.com',
      name: 'John Due',
    });
  });
});
