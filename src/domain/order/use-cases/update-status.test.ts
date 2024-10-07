import { mock, MockProxy } from 'jest-mock-extended';
import { makeOrder } from 'tests/factories/make-order';
import { OrderStatus } from '../entities/value-objects/enums/order-status';
import { OrderRepository } from '../repositories/order';
import { UpdateOrderStatusUseCase } from './update-status';

describe('update order status use case', () => {
  let orderRepository: MockProxy<OrderRepository>;
  let updateOrderStatusUseCase: UpdateOrderStatusUseCase;

  beforeAll(() => {
    orderRepository = mock();
    updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
  });

  it('should update order status successfully', async () => {
    orderRepository.findById.mockResolvedValue(
      makeOrder({ status: OrderStatus.PREPARING }),
    );
    orderRepository.updateStatus.mockResolvedValue();

    const order = await updateOrderStatusUseCase.execute({
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      status: OrderStatus.DONE,
    });

    expect(order).toEqual({
      amount: 20.99,
      createdAt: new Date('2024-07-12T22:18:26.351Z'),
      customer: {
        createdAt: new Date('2024-07-12T22:18:26.351Z'),
        documentNumber: '53523992060',
        email: 'johndue@gmail.com',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        name: 'John Due',
        updatedAt: new Date('2024-07-12T22:18:26.351Z'),
      },
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      number: 123,
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
          notes: 'Sem bacon',
          quantity: 1,
          updatedAt: new Date('2024-07-12T22:18:26.351Z'),
        },
      ],
      status: 'DONE',
      updatedAt: new Date('2024-07-12T22:18:26.351Z'),
    });
    expect(orderRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(orderRepository.updateStatus).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      OrderStatus.DONE,
    );
  });

  it('should throw not found error when order not found', async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(
      updateOrderStatusUseCase.execute({
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        status: OrderStatus.DONE,
      }),
    ).rejects.toThrow('Order not found');

    expect(orderRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('should throw conflict error when order has already been finished', async () => {
    orderRepository.findById.mockResolvedValue(
      makeOrder({ status: OrderStatus.FINISHED }),
    );
    orderRepository.updateStatus.mockResolvedValue();

    await expect(
      updateOrderStatusUseCase.execute({
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        status: OrderStatus.FINISHED,
      }),
    ).rejects.toThrow('Order has already been finished');

    expect(orderRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('should throw conflict error when order must be paid', async () => {
    orderRepository.findById.mockResolvedValue(
      makeOrder({ status: OrderStatus.WAITING_PAYMENT }),
    );
    orderRepository.updateStatus.mockResolvedValue();

    await expect(
      updateOrderStatusUseCase.execute({
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        status: OrderStatus.FINISHED,
      }),
    ).rejects.toThrow('Order payment required');

    expect(orderRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });
});
