import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { ProcessEventUseCase } from '~/domain/payment/use-cases/process-event';

const PAYMENT_ORDER_TOPIC = 'merchant_order';

export class EventController {
  constructor(private processEventUseCase: ProcessEventUseCase) {}

  handler: Controller = async (request: Request): Promise<Response<void>> => {
    logger.info({
      message: 'Process event request',
      data: request,
    });

    const { id, topic } = request.params;

    if (PAYMENT_ORDER_TOPIC === topic) {
      await this.processEventUseCase.execute({ externalId: id });
    }

    return {
      statusCode: 202,
    };
  };
}
