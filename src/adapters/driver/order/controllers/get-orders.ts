import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Order } from '~/domain/order/entities/order';
import { ListOrdersUseCase } from '~/domain/order/use-cases/get-orders';

export class ListOrdersController {
  constructor(
    private listOrdersUseCase: ListOrdersUseCase,
  ) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<Order>> => {

    logger.info({
      message: 'List orders request',
      data: request,
    });

   // Aqui vale adicionar uma validação dos parâmetros de listagem (pageSize, pageNumber, customerId, status)

    const orders = await this.listOrdersUseCase.execute(null);

    return {
      statusCode: 200,
      body: orders,
    };
  };
}
