import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { ProcessEventUseCase } from '~/use-cases/payment/process-event';
import { EventController } from './event';

describe('event controller', () => {
  let processEventUseCase: MockProxy<ProcessEventUseCase>;
  let eventController: EventController;

  beforeAll(() => {
    processEventUseCase = mock();
    eventController = new EventController(processEventUseCase);
  });

  it('should process event successfully', async () => {
    processEventUseCase.execute.mockResolvedValue();

    const response = await eventController.handler({
      params: {
        id: '12345',
        topic: 'merchant_order',
      },
    } as unknown as Request);

    expect(response).toEqual({
      statusCode: 202,
    });
    expect(processEventUseCase.execute).toHaveBeenNthCalledWith(1, {
      externalId: '12345',
    });
  });

  it('should not process when topic is not set', async () => {
    const response = await eventController.handler({
      params: {
        id: '12345',
      },
    } as unknown as Request);

    expect(response).toEqual({
      statusCode: 202,
    });
    expect(processEventUseCase.execute).not.toHaveBeenCalled();
  });

  it('should not process when topic is different of payment order', async () => {
    const response = await eventController.handler({
      params: {
        id: '12345',
        topic: 'payment',
      },
    } as unknown as Request);

    expect(response).toEqual({
      statusCode: 202,
    });
    expect(processEventUseCase.execute).not.toHaveBeenCalled();
  });
});
