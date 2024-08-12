import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { FindCustomerByDocumentNumberUseCase } from '~/domain/customer/use-cases/find-by-document-number';
import { CustomerPresenter } from './presenter/customer';
import { CustomerResponse } from './presenter/dtos/customer-response';

export class FindCustomerByDocumentNumberController {
  constructor(
    private findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase,
  ) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<CustomerResponse>> => {
    const { documentNumber } = request.pathParameters;

    logger.info({
      message: 'Find customer by document number request',
      data: request,
    });

    const customer = await this.findCustomerByDocumentNumberUseCase.execute({
      documentNumber,
    });

    return {
      statusCode: 200,
      body: CustomerPresenter.toHttp(customer),
    };
  };
}
