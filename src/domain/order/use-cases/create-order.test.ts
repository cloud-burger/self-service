import { mock, MockProxy } from 'jest-mock-extended';
import { makeCustomer } from 'tests/factories/make-customer';
import { makeProduct } from 'tests/factories/make-product';
import { FindCustomerByDocumentNumberUseCase } from '~/domain/customer/use-cases/find-by-document-number';
import { OrderRepository } from '../repositories/order';
import { ProductRepository } from '../repositories/product';
import { CreateOrderUseCase } from './create-order';

describe('create order use case', () => {
  let orderRepository: MockProxy<OrderRepository>;
  let productRepository: MockProxy<ProductRepository>;
  let findCustomerByDocumentNumberUseCase: MockProxy<FindCustomerByDocumentNumberUseCase>;
  let createOrderUseCase: CreateOrderUseCase;

  beforeAll(() => {
    orderRepository = mock();
    productRepository = mock();
    findCustomerByDocumentNumberUseCase = mock();
    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      productRepository,
      findCustomerByDocumentNumberUseCase,
    );
  });

  it('should throw when product not found', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(
      createOrderUseCase.execute({
        customerTaxId: null,
        products: [
          {
            id: '123',
            notes: 'no ice',
            quantity: 2,
          },
        ],
      }),
    ).rejects.toThrow('Product not found');

    expect(productRepository.findById).toHaveBeenNthCalledWith(1, '123');
    expect(findCustomerByDocumentNumberUseCase.execute).not.toHaveBeenCalled();
    expect(orderRepository.create).not.toHaveBeenCalled();
  });

  it('should create order with customer successfully', async () => {
    findCustomerByDocumentNumberUseCase.execute.mockResolvedValue(
      makeCustomer(),
    );
    productRepository.findById.mockResolvedValue(makeProduct());
    orderRepository.create.mockResolvedValue(123);

    const order = await createOrderUseCase.execute({
      products: [
        {
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          notes: 'no ice',
          quantity: 2,
        },
      ],
      customerTaxId: '53523992060',
    });

    expect(order).toEqual({
      amount: 41.98,
      createdAt: expect.any(Date),
      number: 123,
      customer: {
        createdAt: expect.any(Date),
        documentNumber: '53523992060',
        email: 'johndue@gmail.com',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        name: 'John Due',
        updatedAt: expect.any(Date),
      },
      id: expect.any(String),
      products: [
        {
          amount: 20.99,
          category: 'BURGER',
          createdAt: new Date('2024-07-12T22:18:26.351Z'),
          description:
            'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          image: null,
          name: 'Bacon Burger',
          notes: 'no ice',
          quantity: 2,
          updatedAt: new Date('2024-07-12T22:18:26.351Z'),
        },
      ],
      status: 'WAITING_PAYMENT',
      updatedAt: expect.any(Date),
    });
    expect(findCustomerByDocumentNumberUseCase.execute).toHaveBeenNthCalledWith(
      1,
      { documentNumber: '53523992060' },
    );
    expect(productRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(orderRepository.create).toHaveBeenNthCalledWith(1, {
      amount: 41.98,
      createdAt: expect.any(Date),
      number: 123,
      customer: {
        createdAt: expect.any(Date),
        documentNumber: '53523992060',
        email: 'johndue@gmail.com',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        name: 'John Due',
        updatedAt: expect.any(Date),
      },
      id: expect.any(String),
      products: [
        {
          amount: 20.99,
          category: 'BURGER',
          createdAt: new Date('2024-07-12T22:18:26.351Z'),
          description:
            'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          image: null,
          name: 'Bacon Burger',
          notes: 'no ice',
          quantity: 2,
          updatedAt: new Date('2024-07-12T22:18:26.351Z'),
        },
      ],
      status: 'WAITING_PAYMENT',
      updatedAt: expect.any(Date),
    });
  });

  it('should create order without customer successfully', async () => {
    productRepository.findById.mockResolvedValue(makeProduct());
    orderRepository.create.mockResolvedValue(123);

    const order = await createOrderUseCase.execute({
      products: [
        {
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          quantity: 2,
          notes: 'no ice',
        },
      ],
    });

    expect(order).toEqual({
      amount: 41.98,
      createdAt: expect.any(Date),
      customer: null,
      number: 123,
      id: expect.any(String),
      products: [
        {
          amount: 20.99,
          category: 'BURGER',
          createdAt: new Date('2024-07-12T22:18:26.351Z'),
          description:
            'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          image: null,
          name: 'Bacon Burger',
          notes: 'no ice',
          quantity: 2,
          updatedAt: new Date('2024-07-12T22:18:26.351Z'),
        },
      ],
      status: 'WAITING_PAYMENT',
      updatedAt: expect.any(Date),
    });
    expect(findCustomerByDocumentNumberUseCase.execute).not.toHaveBeenCalled();
    expect(productRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(orderRepository.create).toHaveBeenNthCalledWith(1, {
      amount: 41.98,
      createdAt: expect.any(Date),
      number: 123,
      customer: null,
      id: expect.any(String),
      products: [
        {
          amount: 20.99,
          category: 'BURGER',
          createdAt: new Date('2024-07-12T22:18:26.351Z'),
          description:
            'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          image: null,
          name: 'Bacon Burger',
          notes: 'no ice',
          quantity: 2,
          updatedAt: new Date('2024-07-12T22:18:26.351Z'),
        },
      ],
      status: 'WAITING_PAYMENT',
      updatedAt: expect.any(Date),
    });
  });
});
